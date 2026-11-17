
// src/components/frame-shop/FrameShop.jsx

import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { motion, useReducedMotion } from "framer-motion";
import { useDispatch, useSelector, useStore } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  ArrowRight,
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
  UserRound,
  Wifi,
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
// FSOCIETY — FRAME VAULT
// =========================================================
//
// Features:
// - Cyberpunk holographic hero
// - Frame rarity catalog
// - Dark / Light mode
// - Responsive layout
// - Search / filters / sorting
// - Server pagination
// - Live FCoin balance verification
// - Universal purchase confirmation modal
// - Duplicate purchase request protection
// - Purchase processing state
// - Success / error notifications
// - Redux integration
//
// Purchase flow:
//
// FrameShopCard
//      |
//      v
// Fetch fresh FCoin balance
//      |
//      v
// FrameShopPurchaseConfirmation
//      |
//      v
// Universal PurchaseConfirmationModal
//      |
//      v
// purchaseProfileFrame Redux thunk
//      |
//      v
// Django FramePurchaseService
//
// IMPORTANT:
// - No frontend-controlled purchase price.
// - The server validates the final price.
// - No duplicate POST for rapid double clicks.
// =========================================================

// =========================================================
// CONSTANTS
// =========================================================

const PAGE_SIZE = 12;

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
// HERO HOLOGRAM
// =========================================================

const Hologram = memo(function Hologram() {
  const reducedMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="
        pointer-events-none relative mx-auto flex
        h-[250px] w-full max-w-[370px]
        items-center justify-center
        sm:h-[310px]
      "
    >
      {/* Ambient glow */}

      <div className="absolute inset-10 rounded-full bg-cyan-400/25 blur-[70px]" />

      <div className="absolute inset-10 translate-x-8 rounded-full bg-violet-500/25 blur-[70px]" />

      {/* Outer orbit */}

      <motion.div
        className="
          absolute h-[238px] w-[238px]
          rounded-full border border-dashed
          border-cyan-300/45
          sm:h-[285px] sm:w-[285px]
        "
        animate={
          reducedMotion
            ? undefined
            : { rotate: 360 }
        }
        transition={{
          duration: 34,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        <span
          className="
            absolute left-1/2 top-[-4px]
            h-2 w-2 rounded-full bg-cyan-300
            shadow-[0_0_19px_#22d3ee]
          "
        />
      </motion.div>

      {/* Inner orbit */}

      <motion.div
        className="
          absolute h-[194px] w-[194px]
          rounded-full border border-violet-300/45
          sm:h-[238px] sm:w-[238px]
        "
        animate={
          reducedMotion
            ? undefined
            : { rotate: -360 }
        }
        transition={{
          duration: 26,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        <span
          className="
            absolute bottom-3 right-4
            h-2 w-2 rounded-full bg-violet-300
            shadow-[0_0_18px_#a78bfa]
          "
        />
      </motion.div>

      {/* Central frame */}

      <div
        className="
          relative flex h-[160px] w-[160px]
          items-center justify-center rounded-full
          bg-gradient-to-br from-cyan-300
          via-violet-500 to-amber-300
          p-[5px]
          shadow-[0_0_55px_rgba(34,211,238,0.34)]
          sm:h-[186px] sm:w-[186px]
        "
      >
        <div
          className="
            flex h-full w-full items-center
            justify-center rounded-full
            border-[7px] border-[#10182b]
            bg-gradient-to-br from-[#1b2a45]
            to-[#070c18]
          "
        >
          <UserRound
            className="h-16 w-16 text-cyan-100/80"
            strokeWidth={1.25}
          />
        </div>

        <span
          className="
            absolute -right-2 top-7 flex
            h-11 w-11 items-center justify-center
            rounded-2xl border border-amber-200/60
            bg-gradient-to-br from-amber-300
            to-orange-500 text-white
            shadow-[0_0_26px_rgba(245,158,11,0.4)]
          "
        >
          <Crown size={21} />
        </span>
      </div>

      {/* Floating labels */}

      <div
        className="
          absolute left-1 top-7 rounded-xl
          border border-cyan-300/25
          bg-slate-950/75 px-3 py-2
          font-mono text-[10px] tracking-wider
          text-cyan-300 shadow-lg backdrop-blur-md
        "
      >
        RARITY: LEGENDARY
      </div>

      <div
        className="
          absolute bottom-5 right-0 rounded-xl
          border border-violet-300/25
          bg-slate-950/75 px-3 py-2
          font-mono text-[10px] tracking-wider
          text-violet-200 shadow-lg backdrop-blur-md
        "
      >
        FS / FRAME VAULT
      </div>
    </div>
  );
});

// =========================================================
// LOADING SKELETON
// =========================================================

const Skeleton = memo(function Skeleton() {
  return (
    <div
      className="
        overflow-hidden rounded-[26px]
        border border-slate-200 bg-white/80
        p-5 dark:border-white/10
        dark:bg-[#101827]/90
      "
    >
      <div className="h-5 w-24 animate-pulse rounded-full bg-slate-200 motion-reduce:animate-none dark:bg-white/10" />

      <div className="mx-auto my-8 h-40 w-40 animate-pulse rounded-full border-[10px] border-slate-200 motion-reduce:animate-none dark:border-white/10" />

      <div className="mx-auto h-5 w-2/3 animate-pulse rounded-lg bg-slate-200 motion-reduce:animate-none dark:bg-white/10" />

      <div className="mt-7 h-11 animate-pulse rounded-xl bg-slate-200 motion-reduce:animate-none dark:bg-white/10" />
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
  // REDUX STATE
  // =====================================================

  const shop = useSelector(selectFrameShop);
  const stats = useSelector(selectFrameStats);
  const mutation = useSelector(selectFrameMutation);

  const loggedIn = useSelector(
    (state) => Boolean(state.auth?.isLoggedIn)
  );

  // =====================================================
  // FILTER STATE
  // =====================================================

  const [search, setSearch] = useState("");

  const [
    debouncedSearch,
    setDebouncedSearch,
  ] = useState("");

  const [rarity, setRarity] = useState("all");
  const [sort, setSort] = useState("default");
  const [page, setPage] = useState(1);

  // =====================================================
  // PURCHASE STATE
  // =====================================================

  // Frame and server-verified balance snapshot.

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
  // PURCHASE LOCKS
  // =====================================================

  const openingLockRef = useRef(false);
  const purchaseLockRef = useRef(false);
  const mountedRef = useRef(true);

  // =====================================================
  // MOUNT STATUS
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
    const timeout = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 350);

    return () => clearTimeout(timeout);
  }, [search]);

  // =====================================================
  // FETCH SHOP
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
        search: debouncedSearch || undefined,
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
  // LOAD AUTHENTICATED STATS
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
  // FILTER AND SORT CURRENT PAGE
  // =====================================================

  const items = useMemo(() => {
    const result = Array.isArray(shop?.items)
      ? [...shop.items]
      : [];

    if (sort === "price_asc") {
      return result.sort(
        (a, b) => framePrice(a) - framePrice(b)
      );
    }

    if (sort === "price_desc") {
      return result.sort(
        (a, b) => framePrice(b) - framePrice(a)
      );
    }

    if (sort === "name") {
      return result.sort((a, b) =>
        String(a?.name || "").localeCompare(
          String(b?.name || ""),
          "uz"
        )
      );
    }

    return result;
  }, [shop?.items, sort]);

  // =====================================================
  // BALANCE
  // =====================================================

  const displayedBalance = loggedIn
    ? parseBalance(stats?.data)
    : null;

  const balanceKnown =
    loggedIn &&
    stats?.loaded &&
    displayedBalance !== null;

  const count = Number(shop?.count) || 0;

  // =====================================================
  // SCROLL TO CATALOG
  // =====================================================

  const scrollToCatalog = useCallback(() => {
    document
      .getElementById("frame-catalog")
      ?.scrollIntoView({
        behavior: reducedMotion
          ? "auto"
          : "smooth",
        block: "start",
      });
  }, [reducedMotion]);

  // =====================================================
  // REFRESH CATALOG
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
        search: debouncedSearch || undefined,
      })
    );
  }, [
    dispatch,
    page,
    rarity,
    debouncedSearch,
  ]);

  // =====================================================
  // OPEN PURCHASE CONFIRMATION
  // =====================================================
  //
  // Steps:
  //
  // 1. Verify authenticated session
  // 2. Validate selected frame
  // 3. Prevent parallel opening
  // 4. Fetch latest FCoin balance
  // 5. Verify account hasn't changed
  // 6. Open universal confirmation modal
  //
  // =====================================================

  const handlePurchaseClick = useCallback(
    async (frame) => {
      // -----------------------------------------------
      // AUTH CHECK
      // -----------------------------------------------

      if (!loggedIn) {
        navigate("/login");
        return;
      }

      // -----------------------------------------------
      // DUPLICATE ACTION PROTECTION
      // -----------------------------------------------

      if (
        openingLockRef.current ||
        purchaseLockRef.current ||
        mutation?.loading ||
        purchasePending ||
        selectedPurchase
      ) {
        return;
      }

      if (!frame?.id || frame?.is_owned) {
        return;
      }

      // -----------------------------------------------
      // FRAME VALIDATION
      // -----------------------------------------------

      const id = Number(frame.id);
      const price = Number(frame.price);

      if (
        !Number.isSafeInteger(id) ||
        id <= 0 ||
        !Number.isSafeInteger(price) ||
        price <= 0
      ) {
        toast.error(
          "Ramka yoki uning narxi noto‘g‘ri. " +
          "Katalogni yangilang."
        );

        return;
      }

      // -----------------------------------------------
      // START BALANCE VERIFICATION
      // -----------------------------------------------

      openingLockRef.current = true;
      setVerifyingFrameId(id);

      const initialUserId = userId(
        store.getState()?.auth?.user
      );

      try {
        // Fetch server balance instead of assuming
        // the cached Navbar balance is current.

        const data = await dispatch(
          fetchProfileFrameStats()
        ).unwrap();

        if (!mountedRef.current) {
          return;
        }

        // ---------------------------------------------
        // ACCOUNT SWITCH PROTECTION
        // ---------------------------------------------

        const currentAuth =
          store.getState()?.auth;

        if (
          !currentAuth?.isLoggedIn ||
          String(userId(currentAuth.user)) !==
            String(initialUserId)
        ) {
          return;
        }

        // ---------------------------------------------
        // PARSE BALANCE
        // ---------------------------------------------

        const freshBalance = parseBalance(data);

        if (freshBalance === null) {
          throw new Error(
            "FCoin balansini aniqlab bo‘lmadi."
          );
        }

        // ---------------------------------------------
        // SHOW UNIVERSAL MODAL
        // ---------------------------------------------

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
  // The universal modal invokes this callback.
  //
  // The useRef lock is synchronous, so even two rapid
  // clicks before React's next render send only one POST.
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

      const { frame, balance } = selectedPurchase;

      const price = Number(frame?.price);

      // -----------------------------------------------
      // FINAL CLIENT-SIDE GUARDS
      // -----------------------------------------------

      if (
        !loggedIn ||
        frame?.is_owned ||
        !Number.isSafeInteger(price) ||
        price <= 0 ||
        balance < price
      ) {
        return;
      }

      // -----------------------------------------------
      // SYNCHRONOUS REQUEST LOCK
      // -----------------------------------------------

      purchaseLockRef.current = true;
      setPurchasePending(true);

      try {
        // ---------------------------------------------
        // BACKEND PURCHASE
        // ---------------------------------------------

        await dispatch(
          purchaseProfileFrame(frame.id)
        ).unwrap();

        if (!mountedRef.current) {
          return;
        }

        // ---------------------------------------------
        // SUCCESS
        // ---------------------------------------------

        setSelectedPurchase(null);

        toast.success(
          `“${frame.name}” ramkasi ` +
          "kolleksiyangizga qo‘shildi!"
        );
      } catch (error) {
        if (!mountedRef.current) {
          return;
        }

        // ---------------------------------------------
        // ERROR
        // ---------------------------------------------

        toast.error(
          typeof error === "string"
            ? error
            : error?.message ||
                "Xarid amalga oshmadi."
        );

        // ---------------------------------------------
        // INVALIDATE OLD BALANCE SNAPSHOT
        // ---------------------------------------------
        //
        // A failed or uncertain request may indicate
        // a changed balance or concurrent purchase.
        //
        // Disable reconfirmation until the balance
        // has been verified again.
        // ---------------------------------------------

        setSelectedPurchase((previous) =>
          previous?.frame?.id === frame.id
            ? {
                ...previous,
                balance: null,
              }
            : previous
        );

        // ---------------------------------------------
        // REFETCH BALANCE
        // ---------------------------------------------
        //
        // Refresh without keeping the modal locked
        // if the network is unavailable.
        // ---------------------------------------------

        dispatch(fetchProfileFrameStats())
          .unwrap()
          .then((data) => {
            const updatedBalance =
              parseBalance(data);

            if (
              mountedRef.current &&
              updatedBalance !== null
            ) {
              setSelectedPurchase((previous) =>
                previous?.frame?.id === frame.id
                  ? {
                      ...previous,
                      balance: updatedBalance,
                    }
                  : previous
              );
            }
          })
          .catch(() => {
            // Confirmation remains disabled until
            // a valid balance is obtained.
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
  // CLOSE PURCHASE MODAL
  // =====================================================

  const closePurchase = useCallback(() => {
    if (
      !purchaseLockRef.current &&
      !purchasePending &&
      !mutation?.loading
    ) {
      setSelectedPurchase(null);
    }
  }, [
    mutation?.loading,
    purchasePending,
  ]);

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <main
      className="
        relative isolate min-h-screen w-full min-w-0
        overflow-hidden px-3 pb-20 pt-6
        text-slate-900 dark:text-white
        sm:px-5 lg:px-8
      "
    >
      {/* BACKGROUND AMBIENCE */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute -left-36 top-16 h-[450px] w-[450px] rounded-full bg-cyan-500/[0.07] blur-[105px]" />

        <div className="absolute -right-40 top-[550px] h-[450px] w-[450px] rounded-full bg-violet-500/[0.08] blur-[110px]" />
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col gap-8">
        {/* ================================================
            HERO
        ================================================ */}

        <section
          className="
            relative isolate overflow-hidden rounded-[30px]
            border border-slate-200/70
            bg-gradient-to-br from-white via-sky-50 to-violet-50
            shadow-[0_18px_60px_rgba(15,23,42,0.07)]
            dark:border-cyan-400/10
            dark:from-[#0b1428]
            dark:via-[#101631]
            dark:to-[#1b1135]
            dark:shadow-[0_25px_100px_rgba(0,0,0,0.28)]
          "
        >
          {/* GRID */}

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-30 dark:opacity-20"
            style={{
              backgroundImage:
                "linear-gradient(rgba(100,116,139,.2) 1px,transparent 1px)," +
                "linear-gradient(90deg,rgba(100,116,139,.2) 1px,transparent 1px)",
              backgroundSize: "38px 38px",
              maskImage:
                "linear-gradient(to bottom,black,transparent)",
            }}
          />

          <div className="relative grid items-center gap-3 px-5 py-9 sm:px-9 lg:grid-cols-[1.15fr_0.85fr] lg:px-12">
            <div className="min-w-0">
              <div
                className="
                  inline-flex items-center gap-2 rounded-full
                  border border-cyan-300/60 bg-cyan-50/80
                  px-3 py-1.5 font-mono text-[10px]
                  font-extrabold tracking-[0.13em]
                  text-cyan-800
                  dark:border-cyan-400/20
                  dark:bg-cyan-400/10
                  dark:text-cyan-300
                "
              >
                <Wifi size={13} />
                FSOCIETY / DIGITAL COLLECTIBLES
              </div>

              <h1
                className="
                  mt-5 max-w-[650px]
                  font-['Space_Grotesk']
                  text-[clamp(2.1rem,5.4vw,4.5rem)]
                  font-black leading-[1.04]
                  tracking-[-0.055em]
                  text-slate-900 dark:text-white
                "
              >
                Profilingga

                <span
                  className="
                    block bg-gradient-to-r
                    from-cyan-600 via-blue-600 to-violet-600
                    bg-clip-text text-transparent
                    dark:from-cyan-300
                    dark:via-blue-400 dark:to-violet-400
                  "
                >
                  o‘z imzoingni qo‘y.
                </span>
              </h1>

              <p className="mt-5 max-w-[520px] text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
                Oddiy avatar emas — sening developer identiteting.
                Noyob ramkalarni FCoin evaziga och,
                kolleksiyangni boyit va profilingni
                boshqalardan ajratib tur.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={scrollToCatalog}
                  className="
                    inline-flex min-h-11 items-center gap-2
                    rounded-xl bg-gradient-to-r
                    from-cyan-500 to-blue-600
                    px-5 py-2.5 text-sm font-bold text-white
                    shadow-[0_8px_26px_rgba(14,165,233,0.26)]
                    transition hover:brightness-110
                    focus-visible:outline
                    focus-visible:outline-2
                    focus-visible:outline-cyan-500
                  "
                >
                  <ShoppingBag size={17} />
                  Ramkalarni ko‘rish
                  <ArrowRight size={16} />
                </button>

                <div
                  className="
                    inline-flex min-h-11 items-center gap-2
                    rounded-xl border border-slate-200
                    bg-white/70 px-4 py-2.5 text-sm
                    backdrop-blur-md dark:border-white/10
                    dark:bg-white/5
                  "
                >
                  <Coins
                    size={17}
                    className="text-amber-500"
                  />

                  <span className="text-slate-600 dark:text-slate-300">
                    FCoin:
                  </span>

                  <span className="font-black tabular-nums">
                    {balanceKnown
                      ? formatNumber(displayedBalance)
                      : "—"}
                  </span>
                </div>
              </div>

              <p className="mt-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.17em] text-slate-500 dark:text-slate-400">
                <Sparkles
                  size={14}
                  className="text-violet-500"
                />
                Collect • Customize • Stand out
              </p>
            </div>

            <Hologram />
          </div>
        </section>

        {/* ================================================
            STATS
        ================================================ */}

        <section
          aria-label="Frame Shop statistikasi"
          className="grid grid-cols-2 gap-3 lg:grid-cols-4"
        >
          {[
            {
              label: "KATALOG",
              value: shop?.loaded
                ? formatNumber(count)
                : "—",
              Icon: Layers3,
              color: "text-cyan-600 dark:text-cyan-300",
            },
            {
              label: "KOLLEKSIYAM",
              value:
                loggedIn && stats?.loaded
                  ? formatNumber(
                      stats?.data?.owned_frames
                    )
                  : "—",
              Icon: Gem,
              color:
                "text-violet-600 dark:text-violet-300",
            },
            {
              label: "FCOIN BALANS",
              value: balanceKnown
                ? formatNumber(displayedBalance)
                : "—",
              Icon: Coins,
              color:
                "text-amber-600 dark:text-amber-300",
            },
            {
              label: "RARITY LEVELS",
              value: "04",
              Icon: Crown,
              color:
                "text-emerald-600 dark:text-emerald-300",
            },
          ].map(
            ({ label, value, Icon, color }) => (
              <div
                key={label}
                className="
                  relative overflow-hidden rounded-2xl
                  border border-slate-200 bg-white/80
                  p-4 backdrop-blur-xl
                  dark:border-white/10
                  dark:bg-[#111827]/75 sm:p-5
                "
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] font-bold tracking-[0.12em] text-slate-500 dark:text-slate-400">
                    {label}
                  </span>

                  <Icon
                    size={18}
                    className={color}
                  />
                </div>

                <p className="mt-3 text-2xl font-black tabular-nums tracking-tight sm:text-3xl">
                  {value}
                </p>

                <span className="absolute bottom-0 left-0 h-[2px] w-1/3 bg-gradient-to-r from-cyan-400/70 to-transparent" />
              </div>
            )
          )}
        </section>

        {/* ================================================
            FRAME CATALOG
        ================================================ */}

        <section
          id="frame-catalog"
          aria-labelledby="frame-catalog-title"
          className="scroll-mt-24"
        >
          {/* HEADER */}

          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">
                <Sparkles size={14} />
                Discover / Unlock / Collect
              </p>

              <h2
                id="frame-catalog-title"
                className="font-['Space_Grotesk'] text-2xl font-black tracking-tight sm:text-3xl"
              >
                Frame{" "}

                <span className="text-cyan-600 dark:text-cyan-300">
                  Collection
                </span>
              </h2>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Profiling uchun noyob dizaynlarni kashf et.
              </p>
            </div>

            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/60 bg-emerald-50 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300">
              <Wifi size={13} />
              LIVE CATALOG
            </span>
          </div>

          {/* ================================================
              SEARCH + SORT
          ================================================ */}

          <div className="mb-6 rounded-[22px] border border-slate-200 bg-white/85 p-3 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-[#101827]/90 sm:p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              {/* SEARCH */}

              <div className="relative min-w-0 flex-1">
                <label
                  htmlFor="frame-search"
                  className="sr-only"
                >
                  Ramka qidirish
                </label>

                <Search
                  size={18}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="frame-search"
                  type="search"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Ramka nomi yoki kodi..."
                  className="
                    h-11 w-full rounded-xl
                    border border-slate-200
                    bg-slate-50/80 pl-11 pr-10
                    text-sm text-slate-900 outline-none
                    focus:border-cyan-400
                    focus:ring-2 focus:ring-cyan-400/10
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* SORT */}

              <div className="flex items-center gap-2">
                <SlidersHorizontal
                  size={17}
                  className="shrink-0 text-slate-500 dark:text-slate-400"
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
                    setSort(event.target.value)
                  }
                  className="
                    h-11 min-w-0 flex-1 rounded-xl
                    border border-slate-200
                    bg-slate-50 px-3 text-sm
                    font-semibold text-slate-700
                    outline-none focus:border-cyan-400
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
                  flex h-11 w-11 shrink-0
                  items-center justify-center rounded-xl
                  border border-slate-200 bg-slate-50
                  text-slate-600 transition
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
                      ? "animate-spin"
                      : ""
                  }
                />
              </button>
            </div>

            {/* ============================================
                RARITY FILTERS
            ============================================ */}

            <div className="mt-4 flex flex-wrap gap-2">
              {FILTERS.map(
                ({ value, label, Icon }) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={rarity === value}
                    onClick={() => {
                      setRarity(value);
                      setPage(1);
                    }}
                    className={`
                      inline-flex min-h-9 items-center
                      gap-1.5 rounded-xl border
                      px-3 py-2 text-xs font-bold
                      transition focus-visible:outline
                      focus-visible:outline-2
                      focus-visible:outline-cyan-500

                      ${
                        rarity === value
                          ? `
                            border-cyan-500
                            bg-cyan-500 text-white
                            shadow-[0_4px_18px_rgba(6,182,212,0.2)]
                          `
                          : `
                            border-slate-200
                            bg-slate-50 text-slate-600
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
                )
              )}
            </div>
          </div>

          {/* ================================================
              RESULTS SUMMARY
          ================================================ */}

          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
            <p>
              {shop?.loading
                ? "Ramkalar yuklanmoqda..."
                : `${formatNumber(count)} ta ramka topildi`}
            </p>

            <p className="font-mono text-[10px] uppercase tracking-wider">
              Sahifa {page} · Saralash: joriy sahifa
            </p>
          </div>

          {/* ================================================
              ERROR
          ================================================ */}

          {shop?.error && !shop?.loading && (
            <div
              role="alert"
              className="
                mb-5 flex flex-wrap items-center
                justify-between gap-3 rounded-2xl
                border border-rose-300/60 bg-rose-50
                p-4 text-sm text-rose-700
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
                className="inline-flex items-center gap-2 rounded-lg border border-current/30 px-3 py-2 font-semibold"
              >
                <RefreshCw size={15} />
                Qayta urinish
              </button>
            </div>
          )}

          {/* ================================================
              LOADING
          ================================================ */}

          {shop?.loading ? (
            <div
              aria-busy="true"
              aria-label="Ramkalar yuklanmoqda"
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 xl:gap-5"
            >
              {Array.from(
                { length: 6 },
                (_, i) => (
                  <Skeleton key={i} />
                )
              )}
            </div>
          ) : !shop?.error && items.length > 0 ? (
            /* ============================================
                FRAME CARDS
            ============================================ */

            <motion.div
              layout={!reducedMotion}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 xl:gap-5"
            >
              {items.map((frame, index) => (
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
                  onPurchase={handlePurchaseClick}
                />
              ))}
            </motion.div>
          ) : !shop?.error ? (
            /* ============================================
                EMPTY STATE
            ============================================ */

            <div
              className="
                rounded-[26px] border border-dashed
                border-slate-300 bg-white/60
                px-5 py-16 text-center
                dark:border-white/15
                dark:bg-white/[0.035]
              "
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-600 dark:text-cyan-300">
                <Search size={28} />
              </div>

              <h3 className="mt-5 text-lg font-bold">
                Ramkalar topilmadi
              </h3>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
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
                className="mt-5 rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-cyan-500"
              >
                Filtrlarni tozalash
              </button>
            </div>
          ) : null}

          {/* ================================================
              PAGINATION
          ================================================ */}

          {!shop?.loading &&
            !shop?.error &&
            count > 0 && (
              <nav
                aria-label="Ramkalar sahifalari"
                className="mt-8 flex items-center justify-center gap-3"
              >
                <button
                  type="button"
                  disabled={
                    !shop?.previous &&
                    page <= 1
                  }
                  onClick={() =>
                    setPage((p) =>
                      Math.max(1, p - 1)
                    )
                  }
                  className="
                    inline-flex h-10 items-center gap-1
                    rounded-xl border border-slate-200
                    bg-white px-4 text-sm font-semibold
                    text-slate-700 transition
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

                <span className="inline-flex h-10 min-w-10 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-3 text-sm font-black text-cyan-700 dark:text-cyan-300">
                  {page}
                </span>

                <button
                  type="button"
                  disabled={!shop?.next}
                  onClick={() =>
                    setPage((p) => p + 1)
                  }
                  className="
                    inline-flex h-10 items-center gap-1
                    rounded-xl border border-slate-200
                    bg-white px-4 text-sm font-semibold
                    text-slate-700 transition
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

      {/* ==================================================
          UNIVERSAL PURCHASE CONFIRMATION MODAL
      ================================================== */}

      <FrameShopPurchaseConfirmation
        isOpen={Boolean(selectedPurchase)}
        frame={selectedPurchase?.frame ?? null}
        balance={selectedPurchase?.balance ?? null}
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
