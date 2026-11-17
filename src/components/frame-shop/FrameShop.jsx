
// src/components/frame-shop/FrameShop.jsx

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
  useStore,
} from "react-redux";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";

import {
  ChevronLeft,
  ChevronRight,
  Coins,
  Crown,
  Gem,
  Layers3,
  RefreshCw,
  Search,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  X,
  Zap,
} from "lucide-react";

import {
  fetchProfileFrameShop,
  fetchProfileFrameStats,
  purchaseProfileFrame,
  selectFrameMutation,
  selectFrameShop,
  selectFrameStats,
} from "../../features/profileFrames";

import FrameShopCard from "./FrameShopCard";
import FrameShopPurchaseConfirmation from "./FrameShopPurchaseConfirmation";

// =========================================================
// FSOCIETY — FRAME SHOP / CYBER VAULT 2.0
// =========================================================
//
// Design:
// - Compact hero
// - Small inline statistics
// - Premium cyber glass
// - Winter background compatibility
// - Responsive search / filters
// - Dark / Light mode
//
// Business logic:
// - Existing Redux contracts
// - Server-driven pagination
// - Client sorting of loaded page
// - Fresh FCoin balance before purchase
// - Purchase confirmation modal
// - Double purchase protection
// - Error / Empty / Loading states
//
// =========================================================

const PAGE_SIZE = 12;

// =========================================================
// FILTERS
// =========================================================

const FILTERS = [
  {
    value: "all",
    label: "Barchasi",
    Icon: Layers3,
  },
  {
    value: "common",
    label: "Common",
    Icon: ShieldCheck,
  },
  {
    value: "rare",
    label: "Rare",
    Icon: Gem,
  },
  {
    value: "epic",
    label: "Epic",
    Icon: Zap,
  },
  {
    value: "legendary",
    label: "Legendary",
    Icon: Crown,
  },
];

const SORTS = [
  {
    value: "default",
    label: "Standart",
  },
  {
    value: "price_asc",
    label: "Arzondan qimmatga",
  },
  {
    value: "price_desc",
    label: "Qimmatdan arzonga",
  },
  {
    value: "name",
    label: "Nom bo‘yicha",
  },
];

// =========================================================
// HELPERS
// =========================================================

const formatNumber = (value) =>
  new Intl.NumberFormat("uz-UZ", {
    maximumFractionDigits: 0,
  }).format(
    Number.isFinite(Number(value))
      ? Number(value)
      : 0
  );

const framePrice = (frame) => {
  const price = Number(frame?.price);

  return Number.isFinite(price)
    ? price
    : 0;
};

const parseBalance = (data) => {
  const raw = data?.coin_balance;

  if (
    raw === null ||
    raw === undefined ||
    raw === ""
  ) {
    return null;
  }

  const balance = Number(raw);

  return (
    Number.isSafeInteger(balance) &&
    balance >= 0
  )
    ? balance
    : null;
};

const userId = (user) =>
  user?.id ?? user?.pk ?? null;

// =========================================================
// COMPACT VAULT MARK
// =========================================================

const VaultMark = memo(function VaultMark() {
  const reducedMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="
        relative grid
        h-12 w-12 shrink-0
        place-items-center
        rounded-2xl
        border border-cyan-400/30
        bg-cyan-400/10
        sm:h-14 sm:w-14
      "
    >
      <div
        className="
          absolute inset-1.5
          rounded-full
          border border-violet-400/35
        "
      />

      <motion.div
        className="
          absolute inset-0
          rounded-full
          border border-dashed
          border-cyan-400/25
        "
        animate={
          reducedMotion
            ? undefined
            : { rotate: 360 }
        }
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <Gem
        strokeWidth={1.7}
        className="
          relative h-6 w-6
          text-cyan-600
          dark:text-cyan-300
          sm:h-7 sm:w-7
        "
      />

      <span
        className="
          absolute -right-1 -top-1
          h-2.5 w-2.5
          rounded-full
          border-2 border-white
          bg-amber-400
          dark:border-[#111827]
        "
      />
    </div>
  );
});

// =========================================================
// CATALOG SKELETON
// =========================================================

const Skeleton = memo(function Skeleton() {
  return (
    <div
      className="
        overflow-hidden
        rounded-[24px]
        border border-slate-200
        bg-white/80 p-5
        dark:border-white/10
        dark:bg-[#101827]/90
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
          mx-auto my-6
          h-32 w-32 animate-pulse
          rounded-full border-[10px]
          border-slate-200
          motion-reduce:animate-none
          dark:border-white/10
        "
      />

      <div
        className="
          mx-auto h-5 w-2/3
          animate-pulse rounded-lg
          bg-slate-200
          motion-reduce:animate-none
          dark:bg-white/10
        "
      />

      <div
        className="
          mt-5 h-10 animate-pulse
          rounded-xl bg-slate-200
          motion-reduce:animate-none
          dark:bg-white/10
        "
      />
    </div>
  );
});

// =========================================================
// MAIN FRAME SHOP
// =========================================================

export default function FrameShop() {
  const dispatch = useDispatch();
  const store = useStore();
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();

  // =====================================================
  // REDUX
  // =====================================================

  const shop = useSelector(
    selectFrameShop
  );

  const stats = useSelector(
    selectFrameStats
  );

  const mutation = useSelector(
    selectFrameMutation
  );

  const loggedIn = useSelector(
    (state) =>
      Boolean(state.auth?.isLoggedIn)
  );

  // =====================================================
  // FILTER STATE
  // =====================================================

  const [search, setSearch] =
    useState("");

  const [
    debouncedSearch,
    setDebouncedSearch,
  ] = useState("");

  const [rarity, setRarity] =
    useState("all");

  const [sort, setSort] =
    useState("default");

  const [page, setPage] =
    useState(1);

  // =====================================================
  // PURCHASE STATE
  // =====================================================

  const [
    selectedPurchase,
    setSelectedPurchase,
  ] = useState(null);

  const [
    verifyingFrameId,
    setVerifyingFrameId,
  ] = useState(null);

  const [
    purchasePending,
    setPurchasePending,
  ] = useState(false);

  // =====================================================
  // REQUEST LOCKS
  // =====================================================

  const openingLockRef =
    useRef(false);

  const purchaseLockRef =
    useRef(false);

  const mountedRef =
    useRef(true);

  // =====================================================
  // MOUNT
  // =====================================================

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  // =====================================================
  // DEBOUNCED SEARCH
  // =====================================================

  useEffect(() => {
    const timeout = setTimeout(
      () =>
        setDebouncedSearch(
          search.trim()
        ),
      350
    );

    return () => clearTimeout(timeout);
  }, [search]);

  // =====================================================
  // FETCH FRAME CATALOG
  // =====================================================

  useEffect(() => {
    const request = dispatch(
      fetchProfileFrameShop({
        page,
        pageSize: PAGE_SIZE,
        rarity:
          rarity === "all"
            ? undefined
            : rarity,
        search:
          debouncedSearch || undefined,
      })
    );

    return () => request.abort();
  }, [
    dispatch,
    page,
    rarity,
    debouncedSearch,
  ]);

  // =====================================================
  // FETCH FRAME STATS
  // =====================================================

  useEffect(() => {
    if (!loggedIn) {
      setSelectedPurchase(null);
      return undefined;
    }

    const request = dispatch(
      fetchProfileFrameStats()
    );

    return () => request.abort();
  }, [dispatch, loggedIn]);

  // =====================================================
  // SORT CURRENT SERVER PAGE
  // =====================================================

  const items = useMemo(() => {
    const result = Array.isArray(
      shop?.items
    )
      ? [...shop.items]
      : [];

    if (sort === "price_asc") {
      return result.sort(
        (a, b) =>
          framePrice(a) - framePrice(b)
      );
    }

    if (sort === "price_desc") {
      return result.sort(
        (a, b) =>
          framePrice(b) - framePrice(a)
      );
    }

    if (sort === "name") {
      return result.sort(
        (a, b) =>
          String(a?.name || "")
            .localeCompare(
              String(b?.name || ""),
              "uz"
            )
      );
    }

    return result;
  }, [shop?.items, sort]);

  // =====================================================
  // DERIVED VALUES
  // =====================================================

  const displayedBalance = loggedIn
    ? parseBalance(stats?.data)
    : null;

  const balanceKnown =
    loggedIn &&
    stats?.loaded &&
    displayedBalance !== null;

  const count =
    Number(shop?.count) || 0;

  const showPagination = Boolean(
    !shop?.loading &&
    !shop?.error &&
    count > 0 &&
    (
      page > 1 ||
      shop?.next ||
      shop?.previous
    )
  );

  // =====================================================
  // REFRESH
  // =====================================================

  const retry = useCallback(() => {
    dispatch(
      fetchProfileFrameShop({
        page,
        pageSize: PAGE_SIZE,
        rarity:
          rarity === "all"
            ? undefined
            : rarity,
        search:
          debouncedSearch || undefined,
      })
    );
  }, [
    dispatch,
    page,
    rarity,
    debouncedSearch,
  ]);

  // =====================================================
  // OPEN PURCHASE MODAL
  // =====================================================
  //
  // Always get the latest server FCoin balance.
  //
  // =====================================================

  const handlePurchaseClick =
    useCallback(
      async (frame) => {
        if (!loggedIn) {
          navigate("/login");
          return;
        }

        if (
          openingLockRef.current ||
          purchaseLockRef.current ||
          mutation?.loading ||
          purchasePending ||
          selectedPurchase
        ) {
          return;
        }

        if (
          !frame?.id ||
          frame?.is_owned
        ) {
          return;
        }

        const id =
          Number(frame.id);

        const price =
          Number(frame.price);

        if (
          !Number.isSafeInteger(id) ||
          id <= 0 ||
          !Number.isSafeInteger(price) ||
          price <= 0
        ) {
          toast.error(
            "Ramka yoki uning narxi noto‘g‘ri. Katalogni yangilang."
          );

          return;
        }

        openingLockRef.current = true;
        setVerifyingFrameId(id);

        const initialUserId = userId(
          store.getState()?.auth?.user
        );

        try {
          const data = await dispatch(
            fetchProfileFrameStats()
          ).unwrap();

          if (!mountedRef.current) {
            return;
          }

          const currentAuth =
            store.getState()?.auth;

          if (
            !currentAuth?.isLoggedIn ||
            String(
              userId(currentAuth.user)
            ) !== String(initialUserId)
          ) {
            return;
          }

          const freshBalance =
            parseBalance(data);

          if (freshBalance === null) {
            throw new Error(
              "FCoin balansini aniqlab bo‘lmadi."
            );
          }

          setSelectedPurchase({
            frame,
            balance: freshBalance,
          });
        } catch (error) {
          if (mountedRef.current) {
            toast.error(
              typeof error === "string"
                ? error
                : error?.message ||
                  "FCoin balansini yuklab bo‘lmadi."
            );
          }
        } finally {
          openingLockRef.current = false;

          if (mountedRef.current) {
            setVerifyingFrameId(null);
          }
        }
      },
      [
        dispatch,
        loggedIn,
        mutation?.loading,
        navigate,
        purchasePending,
        selectedPurchase,
        store,
      ]
    );

  // =====================================================
  // CONFIRM PURCHASE
  // =====================================================
  //
  // Synchronous lock prevents duplicate POSTs.
  //
  // =====================================================

  const confirmPurchase = useCallback(
    async () => {
      if (
        !selectedPurchase ||
        purchaseLockRef.current ||
        mutation?.loading
      ) {
        return;
      }

      const {
        frame,
        balance,
      } = selectedPurchase;

      const price =
        Number(frame?.price);

      if (
        !loggedIn ||
        frame?.is_owned ||
        !Number.isSafeInteger(price) ||
        price <= 0 ||
        balance < price
      ) {
        return;
      }

      purchaseLockRef.current = true;
      setPurchasePending(true);

      try {
        await dispatch(
          purchaseProfileFrame(frame.id)
        ).unwrap();

        if (!mountedRef.current) {
          return;
        }

        setSelectedPurchase(null);

        toast.success(
          `“${frame.name}” ramkasi kolleksiyangizga qo‘shildi!`
        );
      } catch (error) {
        if (!mountedRef.current) {
          return;
        }

        toast.error(
          typeof error === "string"
            ? error
            : error?.message ||
              "Xarid amalga oshmadi."
        );

        // Invalidate potentially stale balance.

        setSelectedPurchase(
          (previous) =>
            previous?.frame?.id === frame.id
              ? {
                  ...previous,
                  balance: null,
                }
              : previous
        );

        dispatch(
          fetchProfileFrameStats()
        )
          .unwrap()
          .then((data) => {
            const updatedBalance =
              parseBalance(data);

            if (
              mountedRef.current &&
              updatedBalance !== null
            ) {
              setSelectedPurchase(
                (previous) =>
                  previous?.frame?.id ===
                  frame.id
                    ? {
                        ...previous,
                        balance:
                          updatedBalance,
                      }
                    : previous
              );
            }
          })
          .catch(() => {
            // Keep confirmation disabled.
          });
      } finally {
        purchaseLockRef.current = false;

        if (mountedRef.current) {
          setPurchasePending(false);
        }
      }
    },
    [
      dispatch,
      loggedIn,
      mutation?.loading,
      selectedPurchase,
    ]
  );

  // =====================================================
  // CLOSE PURCHASE
  // =====================================================

  const closePurchase = useCallback(
    () => {
      if (
        !purchaseLockRef.current &&
        !purchasePending &&
        !mutation?.loading
      ) {
        setSelectedPurchase(null);
      }
    },
    [
      mutation?.loading,
      purchasePending,
    ]
  );

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <main
      className="
        relative isolate
        min-h-screen w-full min-w-0
        overflow-hidden
        px-3 pb-16 pt-3
        text-slate-900 dark:text-white
        sm:px-5 lg:px-8
      "
    >
      {/* ==========================================
          BACKGROUND AMBIENCE
      ========================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute inset-0 -z-10
        "
      >
        <div
          className="
            absolute -left-40 top-0
            h-[380px] w-[380px]
            rounded-full
            bg-cyan-500/[0.055]
            blur-[100px]
          "
        />

        <div
          className="
            absolute -right-36 top-[320px]
            h-[400px] w-[400px]
            rounded-full
            bg-violet-500/[0.055]
            blur-[100px]
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
        {/* ==========================================
            COMPACT PREMIUM HERO
        ========================================== */}

        <section
          className="
            relative isolate
            overflow-hidden
            rounded-[22px]
            border border-slate-200/80
            bg-white/90
            shadow-[0_16px_42px_rgba(15,23,42,0.08)]
            backdrop-blur-2xl

            dark:border-cyan-400/15
            dark:bg-[#0b1426]/90
            dark:shadow-[0_18px_48px_rgba(0,0,0,0.24)]
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
                "radial-gradient(circle at 8% 0%,rgba(34,211,238,0.12),transparent 40%),radial-gradient(circle at 95% 100%,rgba(139,92,246,0.13),transparent 40%)",
            }}
          />

          <div
            className="
              relative flex
              flex-col gap-4
              px-4 py-4
              sm:px-6 sm:py-5

              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >
            {/* TITLE */}

            <div
              className="
                flex min-w-0
                items-center
                gap-3 sm:gap-4
              "
            >
              <VaultMark />

              <div className="min-w-0">
                <p
                  className="
                    mb-1 flex items-center
                    gap-1.5 font-mono
                    text-[9px] font-extrabold
                    uppercase tracking-[0.17em]
                    text-cyan-700
                    dark:text-cyan-300
                  "
                >
                  <Sparkles
                    size={12}
                    aria-hidden="true"
                  />

                  FSOCIETY / FRAME VAULT
                </p>

                <h1
                  className="
                    font-['Space_Grotesk']
                    text-[clamp(1.55rem,3vw,2.35rem)]
                    font-black leading-[1.06]
                    tracking-[-0.045em]
                    text-slate-900
                    dark:text-white
                  "
                >
                  Frame{" "}

                  <span
                    className="
                      bg-gradient-to-r
                      from-cyan-600
                      via-blue-600
                      to-violet-600

                      bg-clip-text
                      text-transparent

                      dark:from-cyan-300
                      dark:via-blue-400
                      dark:to-violet-300
                    "
                  >
                    Shop
                  </span>
                </h1>

                <p
                  className="
                    mt-1.5 max-w-[530px]
                    text-[11px] leading-5
                    text-slate-600
                    dark:text-slate-300
                    sm:text-xs
                  "
                >
                  Profilingga o‘z uslubingni ber.
                  Noyob ramkalarni kashf et, FCoin
                  bilan och va to‘plamni boyit.
                </p>
              </div>
            </div>

            {/* INLINE STATS */}

            <div
              className="
                flex shrink-0
                flex-wrap items-center
                gap-2 lg:justify-end
              "
            >
              <span
                className="
                  inline-flex h-9
                  items-center gap-2
                  rounded-xl

                  border border-slate-200/80
                  bg-white/80 px-3

                  text-[11px] font-semibold
                  text-slate-700

                  dark:border-white/10
                  dark:bg-white/[0.06]
                  dark:text-slate-200
                "
              >
                <Layers3
                  size={14}
                  className="
                    text-cyan-600
                    dark:text-cyan-300
                  "
                />

                <strong className="tabular-nums">
                  {shop?.loaded
                    ? formatNumber(count)
                    : "—"}
                </strong>

                <span
                  className="
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  ramka
                </span>
              </span>

              {loggedIn && (
                <span
                  className="
                    inline-flex h-9
                    items-center gap-2
                    rounded-xl

                    border border-amber-300/40
                    bg-amber-50/85 px-3

                    text-[11px] font-semibold
                    text-amber-800

                    dark:border-amber-400/20
                    dark:bg-amber-400/[0.09]
                    dark:text-amber-200
                  "
                >
                  <Coins size={14} />

                  <strong className="tabular-nums">
                    {balanceKnown
                      ? formatNumber(
                          displayedBalance
                        )
                      : "—"}
                  </strong>

                  FCoin
                </span>
              )}

              <Link
                to="/frames/my"
                className="
                  inline-flex h-9
                  items-center justify-center
                  gap-1.5 rounded-xl

                  border border-violet-400/30
                  bg-violet-500/10
                  px-3

                  text-[11px] font-extrabold
                  text-violet-700

                  transition
                  hover:bg-violet-500/20

                  focus-visible:outline
                  focus-visible:outline-2
                  focus-visible:outline-violet-500

                  dark:text-violet-200
                "
              >
                <Gem size={14} />
                Ramkalarim
              </Link>
            </div>
          </div>

          {/* BOTTOM ACCENT */}

          <span
            aria-hidden="true"
            className="
              absolute inset-x-0 bottom-0
              h-[2px]
              bg-gradient-to-r
              from-cyan-400/70
              via-violet-500/50
              to-transparent
            "
          />
        </section>

        {/* ==========================================
            FRAME CATALOG
        ========================================== */}

        <section
          id="frame-catalog"
          aria-labelledby="frame-catalog-title"
          className="
            min-w-0 scroll-mt-24
          "
        >
          {/* CATALOG HEADING */}

          <div
            className="
              mb-3 flex flex-wrap
              items-center justify-between
              gap-2
            "
          >
            <div
              className="
                flex min-w-0
                items-center gap-2.5
              "
            >
              <span
                className="
                  grid h-8 w-8
                  shrink-0 place-items-center
                  rounded-xl

                  border border-cyan-400/25
                  bg-cyan-400/10
                  text-cyan-600

                  dark:text-cyan-300
                "
              >
                <ShoppingBag size={16} />
              </span>

              <div>
                <h2
                  id="frame-catalog-title"
                  className="
                    font-['Space_Grotesk']
                    text-base font-black
                    tracking-tight

                    text-slate-900
                    dark:text-white

                    sm:text-lg
                  "
                >
                  Kolleksiya{" "}

                  <span
                    className="
                      text-cyan-600
                      dark:text-cyan-300
                    "
                  >
                    / Catalog
                  </span>
                </h2>

                <p
                  className="
                    text-[10px]
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  O‘zingga mos ramkani qidir va tanla
                </p>
              </div>
            </div>

            <span
              className="
                inline-flex items-center gap-1.5
                rounded-full

                border border-emerald-400/20
                bg-emerald-400/[0.07]

                px-2.5 py-1

                font-mono text-[9px]
                font-bold tracking-wider

                text-emerald-700
                dark:text-emerald-300
              "
            >
              <span
                className="
                  h-1.5 w-1.5
                  rounded-full bg-emerald-500
                "
              />

              LIVE CATALOG
            </span>
          </div>

          {/* ======================================
              SEARCH + SORT + RARITY
          ====================================== */}

          <div
            className="
              mb-3 rounded-[19px]
              border border-slate-200/80
              bg-white/90 p-3

              shadow-[0_8px_24px_rgba(15,23,42,0.06)]
              backdrop-blur-2xl

              dark:border-white/10
              dark:bg-[#0c1527]/90

              sm:p-3.5
            "
          >
            <div
              className="
                flex flex-col gap-3
                lg:flex-row lg:items-center
              "
            >
              {/* SEARCH */}

              <div
                className="
                  relative min-w-0 flex-1
                "
              >
                <label
                  htmlFor="frame-search"
                  className="sr-only"
                >
                  Ramka qidirish
                </label>

                <Search
                  size={18}
                  className="
                    pointer-events-none
                    absolute left-3.5 top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                />

                <input
                  id="frame-search"
                  type="search"
                  value={search}
                  onChange={(event) => {
                    setSearch(
                      event.target.value
                    );

                    setPage(1);
                  }}
                  placeholder="Ramka nomi yoki kodi..."
                  className="
                    h-10 w-full
                    rounded-xl

                    border border-slate-200
                    bg-slate-50/80

                    pl-11 pr-10
                    text-sm text-slate-900

                    outline-none
                    focus:border-cyan-400
                    focus:ring-2
                    focus:ring-cyan-400/10

                    dark:border-white/10
                    dark:bg-white/[0.04]
                    dark:text-white
                    dark:placeholder:text-slate-500
                  "
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setDebouncedSearch("");
                      setPage(1);
                    }}
                    aria-label="Qidiruvni tozalash"
                    className="
                      absolute right-3 top-1/2
                      -translate-y-1/2

                      text-slate-400
                      hover:text-slate-700

                      dark:hover:text-white
                    "
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* SORT */}

              <div
                className="
                  flex items-center gap-2
                "
              >
                <SlidersHorizontal
                  size={17}
                  className="
                    shrink-0
                    text-slate-500
                    dark:text-slate-400
                  "
                />

                <label
                  htmlFor="frame-sort"
                  className="sr-only"
                >
                  Joriy sahifani saralash
                </label>

                <select
                  id="frame-sort"
                  value={sort}
                  onChange={(event) =>
                    setSort(
                      event.target.value
                    )
                  }
                  className="
                    h-10 min-w-0 flex-1
                    rounded-xl

                    border border-slate-200
                    bg-slate-50

                    px-3
                    text-sm font-semibold
                    text-slate-700

                    outline-none
                    focus:border-cyan-400

                    dark:border-white/10
                    dark:bg-[#192238]
                    dark:text-slate-200

                    lg:w-[220px]
                  "
                >
                  {SORTS.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* REFRESH */}

              <button
                type="button"
                onClick={retry}
                disabled={shop?.loading}
                title="Katalogni yangilash"
                aria-label="Katalogni yangilash"
                className="
                  flex h-10 w-10
                  shrink-0

                  items-center justify-center
                  rounded-xl

                  border border-slate-200
                  bg-slate-50
                  text-slate-600

                  transition
                  hover:border-cyan-400
                  hover:text-cyan-600

                  disabled:opacity-50

                  dark:border-white/10
                  dark:bg-white/5
                  dark:text-slate-300
                "
              >
                <RefreshCw
                  size={17}
                  className={
                    shop?.loading
                      ? "animate-spin motion-reduce:animate-none"
                      : ""
                  }
                />
              </button>
            </div>

            {/* RARITY FILTERS */}

            <div
              className="
                mt-3 flex flex-wrap
                gap-1.5
              "
            >
              {FILTERS.map(
                ({
                  value,
                  label,
                  Icon,
                }) => {
                  const active =
                    rarity === value;

                  return (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={active}
                      onClick={() => {
                        setRarity(value);
                        setPage(1);
                      }}
                      className={`
                        inline-flex min-h-8
                        items-center gap-1.5
                        rounded-lg border

                        px-2.5 py-1.5

                        text-[11px]
                        font-bold

                        transition

                        focus-visible:outline
                        focus-visible:outline-2
                        focus-visible:outline-cyan-500

                        ${
                          active
                            ? `
                              border-cyan-500
                              bg-cyan-500
                              text-white

                              shadow-[0_4px_18px_rgba(6,182,212,0.2)]
                            `
                            : `
                              border-slate-200
                              bg-slate-50
                              text-slate-600

                              hover:border-cyan-300

                              dark:border-white/10
                              dark:bg-white/5
                              dark:text-slate-300

                              dark:hover:border-cyan-400/40
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
          </div>

          {/* ======================================
              RESULT SUMMARY
          ====================================== */}

          <div
            className="
              mb-3 flex flex-wrap
              items-center justify-between
              gap-2

              text-[11px]
              text-slate-500
              dark:text-slate-400
            "
          >
            <p>
              {shop?.loading
                ? "Ramkalar yuklanmoqda..."
                : `${formatNumber(count)} ta ramka topildi`}
            </p>

            <p
              className="
                font-mono text-[10px]
                uppercase tracking-wider
              "
            >
              Sahifa {page} · Saralash: joriy sahifa
            </p>
          </div>

          {/* ======================================
              ERROR STATE
          ====================================== */}

          {shop?.error &&
            !shop?.loading && (
              <div
                role="alert"
                className="
                  mb-5 flex flex-wrap
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
                  {String(shop.error)}
                </span>

                <button
                  type="button"
                  onClick={retry}
                  className="
                    inline-flex items-center
                    gap-2 rounded-lg
                    border border-current/30

                    px-3 py-2
                    font-semibold
                  "
                >
                  <RefreshCw size={15} />
                  Qayta urinish
                </button>
              </div>
            )}

          {/* ======================================
              FRAME CARDS
          ====================================== */}

          {shop?.loading ? (
            <div
              aria-busy="true"
              aria-label="Ramkalar yuklanmoqda"
              className="
                grid grid-cols-1 gap-3
                sm:grid-cols-2

                xl:grid-cols-3
                xl:gap-4
              "
            >
              {Array.from(
                { length: 6 },
                (_, index) => (
                  <Skeleton key={index} />
                )
              )}
            </div>
          ) : !shop?.error &&
            items.length > 0 ? (
            <motion.div
              layout={!reducedMotion}
              className="
                grid grid-cols-1 gap-3
                sm:grid-cols-2

                xl:grid-cols-3
                xl:gap-4
              "
            >
              {items.map(
                (frame, index) => (
                  <FrameShopCard
                    key={frame.id}
                    frame={frame}
                    index={index}
                    isAuthenticated={loggedIn}
                    isBusy={Boolean(
                      mutation?.loading ||
                      purchasePending ||
                      verifyingFrameId !== null
                    )}
                    onPurchase={
                      handlePurchaseClick
                    }
                  />
                )
              )}
            </motion.div>
          ) : !shop?.error ? (
            <div
              className="
                rounded-[26px]
                border border-dashed
                border-slate-300

                bg-white/60

                px-5 py-16
                text-center

                dark:border-white/15
                dark:bg-white/[0.035]
              "
            >
              <div
                className="
                  mx-auto flex
                  h-16 w-16
                  items-center justify-center

                  rounded-2xl
                  border border-cyan-400/20
                  bg-cyan-400/10

                  text-cyan-600
                  dark:text-cyan-300
                "
              >
                <Search size={28} />
              </div>

              <h3
                className="
                  mt-5 text-lg font-bold
                "
              >
                Ramkalar topilmadi
              </h3>

              <p
                className="
                  mt-2 text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Boshqa nom yoki rarity darajasi
                bilan qidirib ko‘r.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setDebouncedSearch("");
                  setRarity("all");
                  setSort("default");
                  setPage(1);
                }}
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
          ) : null}

          {/* ======================================
              PAGINATION
          ====================================== */}

          {showPagination && (
            <nav
              aria-label="Ramkalar sahifalari"
              className="
                mt-8 flex items-center
                justify-center gap-3
              "
            >
              <button
                type="button"
                disabled={
                  !shop?.previous &&
                  page <= 1
                }
                onClick={() =>
                  setPage(
                    (previous) =>
                      Math.max(
                        1,
                        previous - 1
                      )
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

                  transition
                  hover:border-cyan-400

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
                  inline-flex h-10
                  min-w-10

                  items-center justify-center
                  rounded-xl

                  border border-cyan-400/30
                  bg-cyan-400/10

                  px-3
                  text-sm font-black

                  text-cyan-700
                  dark:text-cyan-300
                "
              >
                {page}
              </span>

              <button
                type="button"
                disabled={!shop?.next}
                onClick={() =>
                  setPage(
                    (previous) =>
                      previous + 1
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

                  transition
                  hover:border-cyan-400

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
      </div>

      {/* ==========================================
          EXISTING PURCHASE CONFIRMATION
      ========================================== */}

      <FrameShopPurchaseConfirmation
        isOpen={Boolean(
          selectedPurchase
        )}
        frame={
          selectedPurchase?.frame ?? null
        }
        balance={
          selectedPurchase?.balance ?? null
        }
        isProcessing={Boolean(
          mutation?.loading ||
          purchasePending
        )}
        onClose={closePurchase}
        onConfirm={confirmPurchase}
      />
    </main>
  );
}
