
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
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  UserRound,
  WandSparkles,
  Zap,
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
// FSOCIETY — MY FRAME VAULT
// =========================================================
//
// Features:
//
// - Authentication
// - Redux inventory and statistics
// - Premium cyberpunk hero
// - WinterBackground compatibility
// - Dark / Light mode
// - Skeleton loading
// - Error / Empty states
// - Equip / Unequip
// - Duplicate request protection
// - Rarity and status filters
// - Server pagination
// - Reduced motion support
//
// Responsive layout:
//
// 1 Frame  -> Centered single card
// 2 Frames -> Two wide cards, slightly shifted right
// 3 Frames -> Three equal columns
// 4 Frames -> Balanced 2x2 grid
// 5+       -> Responsive three-column grid
//
// IMPORTANT:
//
// Backend remains the source of truth.
//
// Only one profile frame can be equipped.
//
// Equip / Unequip never deducts FCoin.
//
// =========================================================

// =========================================================
// CONSTANTS
// =========================================================

const PAGE_SIZE = 9;

const FILTERS = [
  {
    value: "all",
    label: "Barcha ramkalar",
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

const RARITIES = [
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
// RESPONSIVE INVENTORY GRID
// =========================================================
//
// One card:
//       [ FRAME ]
//
// Two cards:
//    [ FRAME ] [ FRAME ]
//
// Three cards:
//  [ FRAME ][ FRAME ][ FRAME ]
//
// Four cards:
//    [ FRAME ] [ FRAME ]
//    [ FRAME ] [ FRAME ]
//
// Five cards:
//  [ FRAME ][ FRAME ][ FRAME ]
//       [ FRAME ][ FRAME ]
//
// NEW:
//
// When exactly two frames are displayed:
//
// - On mobile, no horizontal offset.
// - On lg screens, shift 12px to the right.
// - On xl screens, shift 20px to the right.
//
// IMPORTANT:
//
// Use CSS positioning instead of transform.
//
// Framer Motion also uses CSS transforms
// for its layout animation.
//
// This avoids conflicts with animation.
//
// =========================================================

const getInventoryGridClass = (count) => {
  const common = [
    "mx-auto",
    "grid",
    "w-full",
    "items-stretch",
    "gap-4",
    "xl:gap-5",
  ].join(" ");

  // =====================================================
  // ONE FRAME
  // =====================================================

  if (count === 1) {
    return `
      ${common}
      max-w-[430px]
      grid-cols-1
    `;
  }

  // =====================================================
  // TWO FRAMES — SLIGHT RIGHT OFFSET
  // =====================================================
  //
  // Only this layout receives the adjustment.
  //
  // lg:left-3 -> 12px
  // xl:left-5 -> 20px
  //
  // Card widths stay unchanged.
  //
  // =====================================================

  if (count === 2) {
    return `
      ${common}
      relative
      max-w-[860px]
      grid-cols-1
      md:grid-cols-2
      lg:left-3
      xl:left-5
    `;
  }

  // =====================================================
  // FOUR FRAMES
  // =====================================================

  if (count === 4) {
    return `
      ${common}
      max-w-[860px]
      grid-cols-1
      md:grid-cols-2
    `;
  }

  // =====================================================
  // THREE OR MORE FRAMES
  // =====================================================
  //
  // Six tracks on desktop.
  //
  // Each card spans two tracks.
  //
  // Incomplete final rows are centered.
  //
  // =====================================================

  return `
    ${common}
    max-w-[1180px]
    grid-cols-1
    md:grid-cols-2
    xl:grid-cols-6
  `;
};

// =========================================================
// INVENTORY GRID CELL POSITION
// =========================================================

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

  let className =
    "min-w-0 h-full xl:col-span-2";

  const remainder = count % 3;

  // =====================================================
  // ONE CARD IN FINAL ROW
  // =====================================================

  if (
    remainder === 1 &&
    index === count - 1
  ) {
    className +=
      " xl:col-start-3";
  }

  // =====================================================
  // TWO CARDS IN FINAL ROW
  // =====================================================

  else if (
    remainder === 2 &&
    index === count - 2
  ) {
    className +=
      " xl:col-start-2";
  }

  return className;
};

// =========================================================
// HERO HOLOGRAM
// =========================================================

const InventoryHologram = memo(
  function InventoryHologram() {
    const reducedMotion = useReducedMotion();

    return (
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          relative mx-auto flex
          h-[250px] w-full
          max-w-[340px]
          items-center justify-center
          sm:h-[300px]
        "
      >
        {/* =====================================
            AMBIENT GLOW
        ===================================== */}

        <div
          className="
            absolute inset-10
            rounded-full
            bg-cyan-400/20
            blur-[75px]
          "
        />

        <div
          className="
            absolute inset-10
            translate-x-6
            rounded-full
            bg-violet-500/20
            blur-[75px]
          "
        />

        {/* =====================================
            OUTER ORBIT
        ===================================== */}

        <motion.div
          className="
            absolute
            h-[225px] w-[225px]
            rounded-full
            border border-dashed
            border-cyan-300/45
            sm:h-[275px]
            sm:w-[275px]
          "
          animate={
            reducedMotion
              ? undefined
              : { rotate: 360 }
          }
          transition={{
            duration: 35,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          <span
            className="
              absolute left-1/2
              top-[-4px]
              h-2.5 w-2.5
              rounded-full
              bg-cyan-300
              shadow-[0_0_18px_#22d3ee]
            "
          />
        </motion.div>

        {/* =====================================
            INNER ORBIT
        ===================================== */}

        <motion.div
          className="
            absolute
            h-[190px] w-[190px]
            rounded-full
            border border-violet-300/45
            sm:h-[230px]
            sm:w-[230px]
          "
          animate={
            reducedMotion
              ? undefined
              : { rotate: -360 }
          }
          transition={{
            duration: 27,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          <span
            className="
              absolute bottom-4 right-3
              h-2 w-2
              rounded-full
              bg-violet-300
              shadow-[0_0_18px_#a78bfa]
            "
          />
        </motion.div>

        {/* =====================================
            CENTRAL FRAME
        ===================================== */}

        <div
          className="
            relative
            flex h-[155px] w-[155px]
            items-center justify-center
            rounded-full
            bg-gradient-to-br
            from-cyan-300
            via-violet-500
            to-amber-300
            p-[5px]
            shadow-[0_0_55px_rgba(34,211,238,0.3)]
            sm:h-[185px]
            sm:w-[185px]
          "
        >
          <div
            className="
              flex h-full w-full
              items-center justify-center
              rounded-full
              border-[7px]
              border-[#10182b]
              bg-gradient-to-br
              from-[#1b2a45]
              to-[#070c18]
            "
          >
            <UserRound
              size={65}
              strokeWidth={1.2}
              className="text-cyan-100/80"
            />
          </div>

          <div
            className="
              absolute -right-3 top-6
              flex h-11 w-11
              items-center justify-center
              rounded-xl
              border border-amber-200/50
              bg-gradient-to-br
              from-amber-300
              to-orange-500
              text-white shadow-lg
            "
          >
            <Crown size={22} />
          </div>
        </div>

        {/* =====================================
            FLOATING LABELS
        ===================================== */}

        <div
          className="
            absolute left-0 top-7
            rounded-xl
            border border-cyan-300/25
            bg-slate-950/75
            px-3 py-2
            font-mono text-[10px]
            tracking-wider
            text-cyan-300
            backdrop-blur-md
          "
        >
          COLLECTION / PRIVATE
        </div>

        <div
          className="
            absolute bottom-6 right-0
            rounded-xl
            border border-violet-300/25
            bg-slate-950/75
            px-3 py-2
            font-mono text-[10px]
            tracking-wider
            text-violet-200
            backdrop-blur-md
          "
        >
          EQUIP YOUR IDENTITY
        </div>
      </div>
    );
  }
);

// =========================================================
// LOADING SKELETON
// =========================================================

const InventorySkeleton = memo(
  function InventorySkeleton() {
    return (
      <div
        className="
          h-full w-full
          overflow-hidden
          rounded-[26px]
          border border-slate-200
          bg-white/80 p-5
          dark:border-white/10
          dark:bg-[#0d1424]/90
        "
      >
        <div
          className="
            h-4 w-24 animate-pulse
            rounded-full
            bg-slate-200
            motion-reduce:animate-none
            dark:bg-white/10
          "
        />

        <div
          className="
            mx-auto my-8
            h-40 w-40
            animate-pulse
            rounded-full
            border-[10px]
            border-slate-200
            motion-reduce:animate-none
            dark:border-white/10
          "
        />

        <div
          className="
            mx-auto h-5 w-2/3
            animate-pulse
            rounded-lg
            bg-slate-200
            motion-reduce:animate-none
            dark:bg-white/10
          "
        />

        <div
          className="
            mt-5 h-20
            animate-pulse
            rounded-xl
            bg-slate-100
            motion-reduce:animate-none
            dark:bg-white/5
          "
        />

        <div
          className="
            mt-4 h-11
            animate-pulse
            rounded-xl
            bg-slate-200
            motion-reduce:animate-none
            dark:bg-white/10
          "
        />
      </div>
    );
  }
);

// =========================================================
// STAT CARD
// =========================================================

const StatCard = memo(
  function StatCard({
    label,
    value,
    Icon,
    color,
  }) {
    return (
      <div
        className="
          relative overflow-hidden
          rounded-2xl
          border border-slate-200
          bg-white/80 p-4
          backdrop-blur-xl
          dark:border-white/10
          dark:bg-[#111827]/75
          sm:p-5
        "
      >
        <div
          className="
            flex items-center
            justify-between gap-2
          "
        >
          <span
            className="
              font-mono text-[10px]
              font-bold tracking-[0.12em]
              text-slate-500
              dark:text-slate-400
            "
          >
            {label}
          </span>

          <Icon
            size={18}
            className={color}
            aria-hidden="true"
          />
        </div>

        <p
          className="
            mt-3 text-2xl
            font-black tabular-nums
            tracking-tight
            text-slate-900
            dark:text-white
            sm:text-3xl
          "
        >
          {value}
        </p>

        <div
          className="
            absolute bottom-0 left-0
            h-[2px] w-1/3
            bg-gradient-to-r
            from-cyan-400/70
            to-transparent
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

  const reducedMotion = useReducedMotion();

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

  const [page, setPage] = useState(1);

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
  // REQUEST LOCKS
  // =====================================================

  const requestLockRef = useRef(false);

  const mountedRef = useRef(false);

  // =====================================================
  // MOUNT LIFECYCLE
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

    return () => {
      request.abort();
    };
  }, [
    dispatch,
    isAuthenticated,
    page,
  ]);

  // =====================================================
  // FETCH STATS
  // =====================================================

  useEffect(() => {
    if (!isAuthenticated) {
      return undefined;
    }

    const request = dispatch(
      fetchProfileFrameStats()
    );

    return () => {
      request.abort();
    };
  }, [
    dispatch,
    isAuthenticated,
  ]);

  // =====================================================
  // INVENTORY ITEMS
  // =====================================================

  const allItems = useMemo(
    () =>
      Array.isArray(inventory?.items)
        ? inventory.items
        : [],
    [inventory?.items]
  );

  // =====================================================
  // FILTERS — CURRENT SERVER PAGE
  // =====================================================

  const visibleItems = useMemo(() => {
    return allItems.filter((ownership) => {
      const frame = getOwnedFrame(ownership);

      const equipped = Boolean(
        ownership?.is_equipped
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

  const countNumber = Number(
    inventory?.count
  );

  const totalOwned =
    Number.isFinite(countNumber)
      ? Math.max(0, countNumber)
      : 0;

  // =====================================================
  // EQUIPPED FRAME
  // =====================================================

  const equippedOnPage = allItems.find(
    (ownership) =>
      Boolean(ownership?.is_equipped)
  );

  const equippedFrameId =
    stats?.data?.equipped_frame_id ??
    stats?.data?.equipped_frame?.id ??
    getOwnedFrameId(equippedOnPage);

  const hasEquippedFrame =
    Boolean(equippedFrameId);

  // =====================================================
  // SPENT FCOIN
  // =====================================================

  const totalSpentValue =
    stats?.data?.total_fcoin_spent ??
    stats?.data?.total_coins_spent;

  const totalSpent =
    totalSpentValue == null
      ? "—"
      : formatNumber(totalSpentValue);

  // =====================================================
  // REWARDS ON CURRENT PAGE
  // =====================================================

  const currentPageGifts =
    allItems.filter((ownership) =>
      [
        "gift",
        "event",
        "achievement",
        "event_reward",
      ].includes(ownership?.source)
    ).length;

  // =====================================================
  // PAGINATION
  // =====================================================

  const canGoPrevious = page > 1;

  const canGoNext =
    Boolean(inventory?.next);

  const showPagination = Boolean(
    inventory?.loaded &&
    !inventory?.loading &&
    !inventory?.error &&
    totalOwned > 0 &&
    (
      canGoPrevious ||
      canGoNext
    )
  );

  // =====================================================
  // BALANCED GRID
  // =====================================================

  const gridClass =
    getInventoryGridClass(
      visibleItems.length
    );

  // =====================================================
  // REFRESH
  // =====================================================

  const refreshInventory = useCallback(() => {
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
  }, [
    dispatch,
    isAuthenticated,
    page,
  ]);

  // =====================================================
  // EQUIP
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

      const frame = getOwnedFrame(
        ownership
      );

      const frameId = getOwnedFrameId(
        ownership
      );

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

      // Synchronous request lock.

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

        setPage(1);

        // Update public avatar frame listeners.

        window.dispatchEvent(
          new Event("fsociety:frame-updated")
        );
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
    ]
  );

  // =====================================================
  // UNEQUIP
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

      const frame = getOwnedFrame(
        ownership
      );

      const frameId = getOwnedFrameId(
        ownership
      );

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

        setPage(1);

        window.dispatchEvent(
          new Event("fsociety:frame-updated")
        );
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
    ]
  );

  // =====================================================
  // RESET FILTERS
  // =====================================================

  const resetFilters = useCallback(() => {
    setStatusFilter("all");
    setRarityFilter("all");
  }, []);

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
        min-h-screen w-full
        min-w-0 overflow-hidden
        px-3 pb-20 pt-6
        text-slate-900 dark:text-white
        sm:px-5 lg:px-8
      "
    >
      {/* =====================================
          BACKGROUND AMBIENCE
      ===================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute inset-0 -z-10
        "
      >
        <div
          className="
            absolute -left-32 top-20
            h-[420px] w-[420px]
            rounded-full bg-cyan-400/[0.07]
            blur-[100px]
          "
        />

        <div
          className="
            absolute -right-32 top-[540px]
            h-[420px] w-[420px]
            rounded-full bg-violet-500/[0.08]
            blur-[100px]
          "
        />
      </div>

      <div
        className="
          relative mx-auto flex
          w-full max-w-7xl
          flex-col gap-8
        "
      >
        {/* =====================================
            HERO
        ===================================== */}

        <section
          className="
            relative isolate overflow-hidden
            rounded-[30px]
            border border-slate-200/70
            bg-gradient-to-br
            from-white via-sky-50 to-violet-50
            shadow-[0_18px_60px_rgba(15,23,42,0.06)]
            dark:border-cyan-400/10
            dark:from-[#0b1428]
            dark:via-[#101631]
            dark:to-[#1b1135]
          "
        >
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute inset-0
              opacity-30 dark:opacity-20
            "
            style={{
              backgroundImage:
                "linear-gradient(rgba(100,116,139,.2) 1px, transparent 1px), linear-gradient(90deg,rgba(100,116,139,.2) 1px, transparent 1px)",
              backgroundSize: "38px 38px",
              maskImage:
                "linear-gradient(to bottom, black, transparent)",
            }}
          />

          <div
            className="
              relative grid items-center gap-4
              px-5 py-8
              sm:px-9 sm:py-10
              lg:grid-cols-[1.15fr_0.85fr]
              lg:px-12
            "
          >
            <div className="min-w-0">
              <span
                className="
                  inline-flex items-center gap-2
                  rounded-full border
                  border-cyan-300/60
                  bg-cyan-50/80
                  px-3 py-1.5
                  font-mono text-[10px]
                  font-bold tracking-[0.13em]
                  text-cyan-800
                  dark:border-cyan-400/20
                  dark:bg-cyan-400/10
                  dark:text-cyan-300
                "
              >
                <ShieldCheck size={14} />
                FSOCIETY / PRIVATE INVENTORY
              </span>

              <h1
                className="
                  mt-5
                  font-['Space_Grotesk']
                  text-[clamp(2.2rem,5.5vw,4.5rem)]
                  font-black
                  leading-[1.04]
                  tracking-[-0.055em]
                  text-slate-900 dark:text-white
                "
              >
                My Frame

                <span
                  className="
                    block
                    bg-gradient-to-r
                    from-cyan-600
                    via-violet-600
                    to-fuchsia-600
                    bg-clip-text
                    text-transparent
                    dark:from-cyan-300
                    dark:via-violet-400
                    dark:to-fuchsia-400
                  "
                >
                  Vault.
                </span>
              </h1>

              <p
                className="
                  mt-5 max-w-[510px]
                  text-sm leading-7
                  text-slate-600
                  dark:text-slate-300
                  sm:text-base
                "
              >
                Sening ramkalaring — sening uslubing.
                Xarid qilingan va mukofot sifatida
                olingan ramkalarni boshqar.
                Birini avatar uchun tanla va
                developer identitetingni namoyish et.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  to="/frames/shop"
                  className="
                    inline-flex min-h-11
                    items-center justify-center gap-2
                    rounded-xl
                    bg-gradient-to-r
                    from-cyan-500 to-blue-600
                    px-5 py-2.5
                    text-sm font-bold text-white
                    shadow-[0_8px_25px_rgba(14,165,233,0.24)]
                    transition hover:brightness-110
                  "
                >
                  <ShoppingBag size={17} />
                  Frame Shop
                  <ArrowRight size={16} />
                </Link>

                <div
                  className="
                    inline-flex min-h-11
                    items-center gap-2 rounded-xl
                    border border-slate-200
                    bg-white/70 px-4 py-2.5
                    text-sm font-semibold
                    text-slate-700
                    dark:border-white/10
                    dark:bg-white/5
                    dark:text-slate-200
                  "
                >
                  <Gem
                    size={17}
                    className="text-violet-500"
                  />

                  {inventory?.loaded
                    ? `${formatNumber(totalOwned)} ta ramka`
                    : "Kolleksiya yuklanmoqda"}
                </div>
              </div>

              <p
                className="
                  mt-5 flex items-center gap-2
                  font-mono text-[10px]
                  uppercase tracking-widest
                  text-slate-500
                  dark:text-slate-400
                "
              >
                <Sparkles
                  size={13}
                  className="text-violet-500"
                />

                Own • Equip • Stand Out
              </p>
            </div>

            <InventoryHologram />
          </div>
        </section>

        {/* =====================================
            STATS
        ===================================== */}

        <section
          aria-label="Kolleksiya statistikasi"
          className="
            grid grid-cols-2 gap-3
            lg:grid-cols-4
          "
        >
          <StatCard
            label="MENING RAMKALARIM"
            value={
              inventory?.loaded
                ? formatNumber(totalOwned)
                : "—"
            }
            Icon={Layers3}
            color="text-cyan-600 dark:text-cyan-300"
          />

          <StatCard
            label="FAOL RAMKA"
            value={
              !stats?.loaded &&
              !inventory?.loaded
                ? "—"
                : hasEquippedFrame
                  ? "01"
                  : "00"
            }
            Icon={WandSparkles}
            color="text-emerald-600 dark:text-emerald-300"
          />

          <StatCard
            label="SARFLANGAN FCOIN"
            value={totalSpent}
            Icon={Coins}
            color="text-amber-600 dark:text-amber-300"
          />

          <StatCard
            label="SAHIFADAGI MUKOFOTLAR"
            value={
              inventory?.loaded
                ? formatNumber(currentPageGifts)
                : "—"
            }
            Icon={Crown}
            color="text-violet-600 dark:text-violet-300"
          />
        </section>

        {/* =====================================
            COLLECTION
        ===================================== */}

        <section
          aria-labelledby="inventory-title"
          className="
            min-w-0 scroll-mt-28
          "
        >
          {/* =====================================
              COLLECTION HEADER
          ===================================== */}

          <div
            className="
              mb-6 flex flex-wrap
              items-end justify-between gap-4
            "
          >
            <div>
              <p
                className="
                  mb-2 flex items-center gap-2
                  font-mono text-[10px]
                  font-bold uppercase
                  tracking-[0.17em]
                  text-cyan-700
                  dark:text-cyan-300
                "
              >
                <Zap size={14} />
                Personal Armory
              </p>

              <h2
                id="inventory-title"
                className="
                  font-['Space_Grotesk']
                  text-2xl font-black
                  tracking-tight
                  text-slate-900
                  dark:text-white
                  sm:text-3xl
                "
              >
                Mening{" "}

                <span
                  className="
                    text-cyan-600
                    dark:text-cyan-300
                  "
                >
                  kolleksiyam
                </span>
              </h2>

              <p
                className="
                  mt-2 text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Faqat bitta ramka bir vaqtda
                faol bo‘ladi.
              </p>
            </div>

            <button
              type="button"
              onClick={refreshInventory}
              disabled={
                inventory?.loading ||
                mutation?.loading
              }
              className="
                inline-flex h-10
                items-center gap-2
                rounded-xl
                border border-slate-200
                bg-white/80 px-4
                text-xs font-bold
                text-slate-700
                transition
                hover:border-cyan-400
                disabled:opacity-50
                dark:border-white/10
                dark:bg-white/5
                dark:text-slate-200
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

              Yangilash
            </button>
          </div>

          {/* =====================================
              FILTERS
          ===================================== */}

          <div
            className="
              mb-5 rounded-[22px]
              border border-slate-200
              bg-white/85 p-3
              backdrop-blur-xl
              dark:border-white/10
              dark:bg-[#101827]/90
              sm:p-4
            "
          >
            {/* STATUS FILTER */}

            <div className="flex flex-wrap items-center gap-2">
              {FILTERS.map(
                ({ value, label, Icon }) => {
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
                        inline-flex min-h-10
                        items-center gap-2
                        rounded-xl border
                        px-3 py-2
                        text-xs font-bold
                        transition

                        ${
                          active
                            ? `
                              border-cyan-500
                              bg-cyan-500
                              text-white
                              shadow-[0_4px_18px_rgba(6,182,212,0.18)]
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
                      <Icon size={14} />
                      {label}
                    </button>
                  );
                }
              )}
            </div>

            {/* RARITY FILTER */}

            <div
              className="
                mt-3 flex flex-wrap
                items-center
                justify-between gap-3
              "
            >
              <label
                htmlFor="inventory-rarity"
                className="
                  text-xs font-medium
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Rarity bo‘yicha:
              </label>

              <select
                id="inventory-rarity"
                value={rarityFilter}
                onChange={(event) =>
                  setRarityFilter(
                    event.target.value
                  )
                }
                className="
                  h-10 min-w-[180px]
                  rounded-xl
                  border border-slate-200
                  bg-slate-50 px-3
                  text-sm font-semibold
                  text-slate-700
                  outline-none
                  focus:border-cyan-400
                  dark:border-white/10
                  dark:bg-[#192238]
                  dark:text-slate-200
                "
              >
                {RARITIES.map((item) => (
                  <option
                    key={item.value}
                    value={item.value}
                  >
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <p
              className="
                mt-3 text-[11px]
                text-slate-500
                dark:text-slate-400
              "
            >
              Filtrlar joriy yuklangan sahifadagi
              ramkalarga qo‘llanadi.
            </p>
          </div>

          {/* =====================================
              RESULTS SUMMARY
          ===================================== */}

          <div
            className="
              mb-4 flex flex-wrap
              items-center
              justify-between gap-3
              text-xs text-slate-500
              dark:text-slate-400
            "
          >
            <span>
              {inventory?.loading
                ? "Ramkalar yuklanmoqda..."
                : `${visibleItems.length} ta ramka ko‘rsatilmoqda`}
            </span>

            {showPagination && (
              <span
                className="
                  font-mono text-[10px]
                  uppercase tracking-wider
                "
              >
                Sahifa {page}
              </span>
            )}
          </div>

          {/* =====================================
              ERROR
          ===================================== */}

          {inventory?.error &&
            !inventory?.loading && (
              <div
                role="alert"
                className="
                  mb-5 flex flex-wrap
                  items-center
                  justify-between gap-3
                  rounded-2xl
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
                  <RefreshCw size={15} />
                  Qayta urinish
                </button>
              </div>
            )}

          {/* =====================================
              LOADING SKELETONS
          ===================================== */}

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

          {/* =====================================
              FRAME CARDS
          ===================================== */}
          {/*
            Card width stays controlled by CSS Grid.

            Two frames:
            - max-width: 860px
            - Two equal columns on desktop
            - 12px right offset on lg
            - 20px right offset on xl

            Other frame counts:
            - Original centered layout
          */}

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
                        ownership.id ??
                        getOwnedFrameId(ownership) ??
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

          {/* =====================================
              EMPTY COLLECTION
          ===================================== */}

          {!authLoading &&
            !inventory?.loading &&
            !inventory?.error &&
            inventory?.loaded &&
            totalOwned === 0 && (
              <div
                className="
                  rounded-[26px]
                  border border-dashed
                  border-slate-300
                  bg-white/70
                  px-5 py-16
                  text-center
                  dark:border-white/15
                  dark:bg-white/[0.035]
                "
              >
                <div
                  className="
                    mx-auto flex h-16 w-16
                    items-center justify-center
                    rounded-2xl
                    border border-cyan-400/20
                    bg-cyan-400/10
                    text-cyan-600
                    dark:text-cyan-300
                  "
                >
                  <PackageOpen size={29} />
                </div>

                <h3
                  className="
                    mt-5 text-lg font-bold
                    text-slate-900
                    dark:text-white
                  "
                >
                  Kolleksiyang hozircha bo‘sh
                </h3>

                <p
                  className="
                    mx-auto mt-2 max-w-sm
                    text-sm leading-6
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  Frame Shop orqali birinchi
                  ramkangni sotib ol yoki tadbirlarda
                  qatnashib maxsus mukofotlarni
                  qo‘lga kirit.
                </p>

                <Link
                  to="/frames/shop"
                  className="
                    mt-5 inline-flex
                    items-center gap-2
                    rounded-xl
                    bg-gradient-to-r
                    from-cyan-500 to-blue-600
                    px-5 py-3
                    text-sm font-bold
                    text-white
                    transition hover:brightness-110
                  "
                >
                  <ShoppingBag size={17} />
                  Frame Shop'ga o‘tish
                  <ArrowRight size={16} />
                </Link>
              </div>
            )}

          {/* =====================================
              FILTERED EMPTY
          ===================================== */}

          {!authLoading &&
            !inventory?.loading &&
            !inventory?.error &&
            inventory?.loaded &&
            totalOwned > 0 &&
            visibleItems.length === 0 && (
              <div
                className="
                  rounded-[26px]
                  border border-dashed
                  border-slate-300
                  bg-white/70
                  px-5 py-14
                  text-center
                  dark:border-white/15
                  dark:bg-white/[0.035]
                "
              >
                <Gem
                  size={32}
                  className="
                    mx-auto
                    text-violet-500
                    dark:text-violet-300
                  "
                />

                <h3 className="mt-4 text-lg font-bold">
                  Mos ramka topilmadi
                </h3>

                <p
                  className="
                    mt-2 text-sm
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  Bu sahifada tanlangan filtrga
                  mos ramka yo‘q.
                </p>

                <button
                  type="button"
                  onClick={resetFilters}
                  className="
                    mt-5 rounded-xl
                    bg-cyan-600
                    px-4 py-2.5
                    text-sm font-bold
                    text-white
                    hover:bg-cyan-500
                  "
                >
                  Filtrlarni tozalash
                </button>
              </div>
            )}

          {/* =====================================
              PAGINATION
          ===================================== */}

          {showPagination && (
            <nav
              aria-label="Kolleksiya sahifalari"
              className="
                mt-8 flex items-center
                justify-center gap-3
              "
            >
              <button
                type="button"
                disabled={
                  !canGoPrevious ||
                  mutation?.loading
                }
                onClick={() =>
                  setPage((old) =>
                    Math.max(1, old - 1)
                  )
                }
                className="
                  inline-flex h-10
                  items-center gap-1
                  rounded-xl
                  border border-slate-200
                  bg-white px-4
                  text-sm font-semibold
                  text-slate-700
                  transition hover:border-cyan-400
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                  dark:border-white/10
                  dark:bg-[#111827]
                  dark:text-slate-200
                "
              >
                <ChevronLeft size={17} />
                Oldingi
              </button>

              <span
                className="
                  inline-flex h-10 min-w-10
                  items-center justify-center
                  rounded-xl
                  border border-cyan-400/30
                  bg-cyan-400/10
                  px-3 text-sm
                  font-black tabular-nums
                  text-cyan-700
                  dark:text-cyan-300
                "
              >
                {page}
              </span>

              <button
                type="button"
                disabled={
                  !canGoNext ||
                  mutation?.loading
                }
                onClick={() =>
                  setPage((old) =>
                    old + 1
                  )
                }
                className="
                  inline-flex h-10
                  items-center gap-1
                  rounded-xl
                  border border-slate-200
                  bg-white px-4
                  text-sm font-semibold
                  text-slate-700
                  transition hover:border-cyan-400
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                  dark:border-white/10
                  dark:bg-[#111827]
                  dark:text-slate-200
                "
              >
                Keyingi
                <ChevronRight size={17} />
              </button>
            </nav>
          )}
        </section>

        {/* =====================================
            BOTTOM BANNER
        ===================================== */}

        <section
          className="
            relative overflow-hidden
            rounded-[24px]
            border border-violet-300/30
            bg-gradient-to-r
            from-violet-50 via-sky-50 to-cyan-50
            p-5
            dark:border-violet-400/15
            dark:from-[#1a1433]
            dark:via-[#141e38]
            dark:to-[#0b2736]
            sm:p-7
          "
        >
          <div
            className="
              relative flex flex-col
              justify-between gap-4
              sm:flex-row sm:items-center
            "
          >
            <div className="flex items-start gap-3">
              <div
                className="
                  flex h-11 w-11
                  shrink-0 items-center
                  justify-center rounded-xl
                  bg-violet-500/15
                  text-violet-600
                  dark:text-violet-300
                "
              >
                <Sparkles size={21} />
              </div>

              <div>
                <h3
                  className="
                    font-['Space_Grotesk']
                    text-base font-bold
                    text-slate-900
                    dark:text-white
                    sm:text-lg
                  "
                >
                  Your code. Your identity.
                </h3>

                <p
                  className="
                    mt-1 text-xs leading-6
                    text-slate-600
                    dark:text-slate-300
                    sm:text-sm
                  "
                >
                  Ramkalar faqat bezak emas —
                  FSociety'dagi yutuqlaringning
                  bir qismi.
                </p>
              </div>
            </div>

            <Link
              to="/frames/shop"
              className="
                inline-flex items-center
                justify-center gap-2
                self-start rounded-xl
                border border-violet-300/50
                bg-white/70 px-4 py-2.5
                text-xs font-bold
                text-violet-700
                transition hover:bg-white
                dark:border-violet-400/25
                dark:bg-white/5
                dark:text-violet-200
                dark:hover:bg-white/10
              "
            >
              Yangi ramkalar
              <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
