
import React, { memo, useId } from "react";

// =========================================================
// FSOCIETY — WINTER LANDSCAPE
// Cyberpunk Arctic City / Frozen Lake
// =========================================================

const STAR_POINTS = Array.from({ length: 42 }, (_, index) => ({
  id: index,
  x: ((index * 137 + 37) % 1880) + 20,
  y: ((index * 83 + 19) % 460) + 20,
  r: index % 7 === 0 ? 2 : index % 3 === 0 ? 1.5 : 1,
  opacity: 0.28 + ((index * 7) % 60) / 100,
}));

const LEFT_BUILDINGS = [
  { x: 105, width: 76, height: 265, spike: true },
  { x: 195, width: 88, height: 340, spike: true },
  { x: 300, width: 75, height: 215, spike: false },
  { x: 390, width: 100, height: 300, spike: true },
  { x: 510, width: 76, height: 190, spike: false },
  { x: 590, width: 92, height: 255, spike: true },
];

const RIGHT_BUILDINGS = [
  { x: 1240, width: 85, height: 235, spike: false },
  { x: 1340, width: 95, height: 345, spike: true },
  { x: 1450, width: 80, height: 280, spike: true },
  { x: 1545, width: 110, height: 395, spike: true },
  { x: 1670, width: 85, height: 270, spike: false },
  { x: 1770, width: 90, height: 340, spike: true },
];

const FOREST_TREES = [
  { x: -45, y: 900, scale: 1.4 },
  { x: 35, y: 850, scale: 1.15 },
  { x: 125, y: 890, scale: 1.05 },
  { x: 205, y: 850, scale: 0.95 },
  { x: 285, y: 900, scale: 0.78 },
  { x: 390, y: 885, scale: 0.64 },
  { x: 1510, y: 900, scale: 0.72 },
  { x: 1600, y: 865, scale: 0.9 },
  { x: 1690, y: 900, scale: 1.05 },
  { x: 1785, y: 850, scale: 1.18 },
  { x: 1880, y: 900, scale: 1.35 },
];

const PALETTES = {
  dark: {
    skyTop: "#02091D",
    skyMiddle: "#06234B",
    skyBottom: "#103B69",

    cityBack: "#102B50",
    cityFront: "#071A35",
    cityStroke: "#2563A3",

    windows: "#38BDF8",
    windowsWarm: "#FDBA74",

    mountainBack: "#1C426B",
    mountainFront: "#0E3054",

    forest: "#082E40",
    forestDark: "#061E36",
    forestSnow: "#BDEBFA",

    snow: "#DFF7FF",
    snowShadow: "#82C7E8",

    waterTop: "#072B52",
    waterBottom: "#020E25",
    waterLight: "#22D3EE",

    bridge: "#527FA6",
    bridgeLight: "#67E8F9",

    cabin: "#382A31",
    cabinRoof: "#142A48",
    cabinWindow: "#FCD38D",

    moon: "#E0F2FE",
    moonGlow: "#60A5FA",

    horizonGlow: "#22D3EE",
  },

  light: {
    skyTop: "#B9DDF7",
    skyMiddle: "#D8EDFF",
    skyBottom: "#EEF8FF",

    cityBack: "#8AB4D9",
    cityFront: "#567FA8",
    cityStroke: "#6D9CC5",

    windows: "#65A5D8",
    windowsWarm: "#E9A85E",

    mountainBack: "#A9CDE8",
    mountainFront: "#83B4DA",

    forest: "#397C7A",
    forestDark: "#245C69",
    forestSnow: "#FFFFFF",

    snow: "#FFFFFF",
    snowShadow: "#B8D9F0",

    waterTop: "#B3DAF4",
    waterBottom: "#78B0D8",
    waterLight: "#FFFFFF",

    bridge: "#648DAE",
    bridgeLight: "#FFFFFF",

    cabin: "#927B70",
    cabinRoof: "#6689A8",
    cabinWindow: "#F7C77D",

    moon: "#FFFFFF",
    moonGlow: "#DBEEFF",

    horizonGlow: "#60A5FA",
  },
};

// =========================================================
// CITY BUILDING
// =========================================================

const CityBuilding = memo(function CityBuilding({
  building,
  palette,
  index,
}) {
  const { x, width, height, spike } = building;
  const top = 770 - height;

  const rows = Math.floor(height / 30);
  const columns = Math.max(2, Math.floor(width / 22));

  return (
    <g>
      {/* Building body */}
      <path
        d={`
          M${x} 770
          L${x} ${top + 15}
          L${x + width / 2} ${top}
          L${x + width} ${top + 15}
          L${x + width} 770
          Z
        `}
        fill={palette.cityFront}
        stroke={palette.cityStroke}
        strokeOpacity="0.55"
        strokeWidth="2"
      />

      {/* Building top */}
      <path
        d={`
          M${x} ${top + 15}
          L${x + width / 2} ${top}
          L${x + width} ${top + 15}
        `}
        stroke={palette.windows}
        strokeOpacity="0.55"
        strokeWidth="2"
        fill="none"
      />

      {/* Windows */}
      {Array.from({ length: rows * columns }, (_, windowIndex) => {
        const row = Math.floor(windowIndex / columns);
        const column = windowIndex % columns;

        const windowX = x + 12 + column * 18;
        const windowY = top + 34 + row * 26;

        if (
          windowX + 6 > x + width - 6 ||
          windowY > 750
        ) {
          return null;
        }

        const isWarm =
          (windowIndex + index) % 9 === 0;

        return (
          <rect
            key={`${index}-${windowIndex}`}
            x={windowX}
            y={windowY}
            width="5"
            height="10"
            rx="1"
            fill={isWarm ? palette.windowsWarm : palette.windows}
            opacity={0.25 + ((windowIndex * 13) % 70) / 100}
          />
        );
      })}

      {/* Tower antenna */}
      {spike && (
        <g>
          <path
            d={`M${x + width / 2} ${top}V${top - 65}`}
            stroke={palette.bridgeLight}
            strokeWidth="2"
            opacity="0.7"
          />

          <circle
            cx={x + width / 2}
            cy={top - 68}
            r="3"
            fill={palette.windowsWarm}
          />

          <circle
            cx={x + width / 2}
            cy={top - 68}
            r="8"
            fill={palette.windowsWarm}
            opacity="0.16"
          />
        </g>
      )}

      {/* Edge light */}
      <path
        d={`M${x + width - 5} ${top + 18}V750`}
        stroke={palette.windows}
        strokeWidth="1"
        strokeOpacity="0.4"
      />
    </g>
  );
});

// =========================================================
// SNOWY PINE TREE
// =========================================================

const PineTree = memo(function PineTree({
  palette,
  scale = 1,
  x = 0,
  y = 0,
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {/* Shadow */}
      <ellipse
        cx="50"
        cy="174"
        rx="48"
        ry="7"
        fill="#061A2E"
        opacity="0.22"
      />

      {/* Trunk */}
      <path
        d="M43 135H57V177H43Z"
        fill="#634B42"
      />

      {/* Tree body */}
      <path
        d="
          M50 0
          L26 48
          L36 48
          L13 88
          L29 88
          L3 132
          L97 132
          L71 88
          L87 88
          L64 48
          L74 48
          Z
        "
        fill={palette.forest}
        stroke={palette.windows}
        strokeOpacity="0.28"
        strokeWidth="1.5"
      />

      {/* Snow caps */}
      <g fill={palette.forestSnow}>
        <path d="M50 0L41 19L50 16L58 20Z" />

        <path
          d="M26 48Q50 40 74 48L68 39Q50 43 32 39Z"
          opacity="0.9"
        />

        <path
          d="M13 88Q50 79 87 88L82 78Q50 83 18 78Z"
          opacity="0.88"
        />

        <path
          d="M3 132Q50 119 97 132L89 120Q50 126 11 120Z"
          opacity="0.95"
        />
      </g>

      {/* Branch accents */}
      <path
        d="M50 4V130M27 50H73M15 91H85"
        stroke={palette.windows}
        strokeWidth="1"
        strokeOpacity="0.28"
        strokeDasharray="3 5"
      />

      {/* Tiny glowing bulbs */}
      <g>
        <circle cx="35" cy="60" r="2.7" fill="#22D3EE" />
        <circle cx="64" cy="74" r="2.7" fill="#FDE68A" />
        <circle cx="35" cy="103" r="3" fill="#A78BFA" />
        <circle cx="70" cy="116" r="3" fill="#F472B6" />
      </g>
    </g>
  );
});

// =========================================================
// SNOWY MOUNTAINS
// =========================================================

const Mountains = memo(function Mountains({ palette }) {
  return (
    <g>
      {/* Far mountains */}
      <path
        d="
          M0 760
          L120 655
          L205 702
          L340 570
          L455 687
          L585 590
          L710 690
          L850 560
          L1000 680
          L1115 590
          L1260 685
          L1410 550
          L1530 663
          L1660 565
          L1790 690
          L1920 600
          L1920 820
          L0 820
          Z
        "
        fill={palette.mountainBack}
        opacity="0.8"
      />

      {/* Front mountains */}
      <path
        d="
          M0 800
          L175 690
          L300 765
          L445 635
          L585 785
          L760 660
          L925 785
          L1110 650
          L1270 778
          L1450 650
          L1600 770
          L1745 665
          L1920 790
          L1920 890
          L0 890
          Z
        "
        fill={palette.mountainFront}
        opacity="0.88"
      />

      {/* Mountain snow highlights */}
      <g
        fill={palette.snow}
        opacity="0.85"
      >
        <path d="M120 655L175 690L143 683L120 655Z" />
        <path d="M340 570L399 647L340 621L306 651Z" />
        <path d="M850 560L910 654L850 617L807 653Z" />
        <path d="M1410 550L1470 652L1410 609L1370 647Z" />
        <path d="M1660 565L1713 650L1660 622L1620 653Z" />
      </g>
    </g>
  );
});

// =========================================================
// CYBER NETWORK SKY
// =========================================================

const CyberNetwork = memo(function CyberNetwork({
  palette,
}) {
  const lines = [
    [70, 270, 310, 350],
    [310, 350, 490, 240],
    [490, 240, 690, 330],
    [1260, 290, 1430, 205],
    [1430, 205, 1620, 330],
    [1620, 330, 1860, 225],
    [100, 470, 275, 390],
    [275, 390, 475, 480],
    [1460, 450, 1620, 330],
    [1620, 330, 1820, 480],
  ];

  const nodes = [
    [70, 270],
    [310, 350],
    [490, 240],
    [690, 330],
    [1260, 290],
    [1430, 205],
    [1620, 330],
    [1860, 225],
    [100, 470],
    [475, 480],
    [1460, 450],
    [1820, 480],
  ];

  return (
    <g
      stroke={palette.windows}
      strokeOpacity="0.2"
      fill="none"
    >
      {lines.map(([x1, y1, x2, y2], index) => (
        <path
          key={index}
          d={`M${x1} ${y1}L${x2} ${y2}`}
          strokeWidth="1"
        />
      ))}

      {nodes.map(([x, y], index) => (
        <g key={index}>
          <circle
            cx={x}
            cy={y}
            r="5"
            fill={palette.windows}
            fillOpacity="0.65"
            stroke="none"
          />

          <circle
            cx={x}
            cy={y}
            r="11"
            stroke={palette.windows}
            strokeOpacity="0.28"
          />
        </g>
      ))}
    </g>
  );
});

// =========================================================
// MOON AND SANTA SLEIGH
// =========================================================

const MoonAndSleigh = memo(function MoonAndSleigh({
  palette,
}) {
  return (
    <g>
      {/* Moon glow */}
      <circle
        cx="490"
        cy="142"
        r="108"
        fill={palette.moonGlow}
        opacity="0.13"
      />

      {/* Moon */}
      <circle
        cx="490"
        cy="142"
        r="66"
        fill={palette.moon}
        opacity="0.95"
      />

      {/* Moon texture */}
      <g
        fill={palette.mountainBack}
        opacity="0.2"
      >
        <circle cx="464" cy="125" r="12" />
        <circle cx="516" cy="164" r="17" />
        <circle cx="504" cy="104" r="8" />
      </g>

      {/* Sleigh and reindeer silhouette */}
      <g
        transform="translate(570 108)"
        fill="#071629"
        opacity="0.9"
      >
        <path d="M0 42Q34 52 77 44L69 55Q32 60 0 48Z" />
        <path
          d="M10 38L21 22L43 22L54 39L40 43L15 43Z"
        />

        <path
          d="M-5 48Q-28 56 -38 40"
          fill="none"
          stroke="#071629"
          strokeWidth="4"
        />

        {/* Reindeer bodies */}
        {[85, 128, 170].map((position) => (
          <g
            key={position}
            transform={`translate(${position} 15)`}
          >
            <ellipse
              cx="0"
              cy="0"
              rx="15"
              ry="7"
            />

            <path d="M10 -1L17 -13L22 -10L17 0Z" />

            <path
              d="M17 -13L21 -23L25 -24M18 -13L12 -22"
              fill="none"
              stroke="#071629"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            <path
              d="M-8 4L-12 18M4 4L9 17M-2 4L-3 17"
              stroke="#071629"
              strokeWidth="3"
              fill="none"
            />
          </g>
        ))}

        {/* Reins */}
        <path
          d="M63 40Q120 4 183 18"
          stroke="#071629"
          strokeWidth="2"
          fill="none"
        />
      </g>
    </g>
  );
});

// =========================================================
// LEFT WINTER CABIN
// =========================================================

const WinterCabin = memo(function WinterCabin({
  palette,
}) {
  return (
    <g transform="translate(20 595)">
      {/* Cabin body */}
      <path
        d="M0 85L115 0L245 85V206H0Z"
        fill={palette.cabin}
        stroke={palette.bridge}
        strokeWidth="2"
      />

      {/* Snow roof */}
      <path
        d="M-16 87L115 -8L260 87L245 98L115 25L0 98Z"
        fill={palette.snow}
        stroke={palette.snowShadow}
        strokeWidth="2"
      />

      {/* Chimney */}
      <rect
        x="184"
        y="18"
        width="20"
        height="48"
        fill={palette.cabinRoof}
      />

      <path
        d="M180 20H209L205 12H185Z"
        fill={palette.snow}
      />

      {/* Warm windows */}
      <g
        fill={palette.cabinWindow}
        stroke="#F59E0B"
        strokeWidth="3"
      >
        <rect x="20" y="111" width="48" height="48" rx="3" />
        <rect x="146" y="111" width="48" height="48" rx="3" />
      </g>

      <g
        stroke="#7C4A26"
        strokeWidth="3"
      >
        <path d="M44 111V159M20 135H68" />
        <path d="M170 111V159M146 135H194" />
      </g>

      {/* Door */}
      <rect
        x="90"
        y="123"
        width="48"
        height="83"
        rx="4"
        fill="#172A43"
        stroke={palette.bridge}
        strokeWidth="2"
      />

      <circle
        cx="128"
        cy="165"
        r="3"
        fill={palette.windowsWarm}
      />

      {/* Warm light */}
      <path
        d="M20 159L70 159L90 205H0Z"
        fill={palette.cabinWindow}
        opacity="0.09"
      />

      {/* Roof snow highlights */}
      <path
        d="M-5 87L115 9L255 90"
        stroke="#FFFFFF"
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.75"
        fill="none"
      />
    </g>
  );
});

// =========================================================
// BRIDGE
// =========================================================

const WinterBridge = memo(function WinterBridge({
  palette,
}) {
  return (
    <g>
      {/* Bridge deck */}
      <path
        d="M470 792Q950 700 1450 792"
        fill="none"
        stroke={palette.bridge}
        strokeWidth="12"
      />

      {/* Bridge light rail */}
      <path
        d="M470 782Q950 690 1450 782"
        fill="none"
        stroke={palette.bridgeLight}
        strokeWidth="3"
        opacity="0.85"
      />

      {/* Bridge underside */}
      <path
        d="M500 795Q950 1000 1420 795"
        fill="none"
        stroke={palette.bridge}
        strokeWidth="7"
        opacity="0.7"
      />

      {/* Bridge supports */}
      <path
        d="
          M650 780L650 890
          M950 745L950 900
          M1250 780L1250 890
        "
        stroke={palette.bridge}
        strokeWidth="5"
        opacity="0.65"
      />

      {/* Bridge lights */}
      {[550, 650, 750, 850, 950, 1050, 1150, 1250, 1350].map(
        (x, index) => (
          <circle
            key={x}
            cx={x}
            cy={776 - Math.sin(index / 8 * Math.PI) * 60}
            r="4"
            fill={palette.windowsWarm}
          />
        )
      )}
    </g>
  );
});

// =========================================================
// FROZEN LAKE
// =========================================================

const FrozenLake = memo(function FrozenLake({
  palette,
}) {
  return (
    <g>
      {/* Lake base */}
      <path
        d="M0 785Q420 820 820 790T1920 785V1080H0Z"
        fill={palette.waterBottom}
      />

      {/* Reflection center */}
      <path
        d="M500 800Q960 840 1450 800L1620 1080H270Z"
        fill={palette.waterTop}
        opacity="0.7"
      />

      {/* Reflected city lights */}
      {Array.from({ length: 21 }, (_, index) => {
        const x = 120 + index * 83;

        return (
          <g key={index}>
            <path
              d={`M${x} 825V${850 + (index % 5) * 28}`}
              stroke={
                index % 4 === 0
                  ? palette.windowsWarm
                  : palette.waterLight
              }
              strokeWidth={index % 3 === 0 ? 3 : 1.5}
              strokeOpacity="0.35"
            />

            <path
              d={`M${x - 16} ${840 + (index % 4) * 16}H${x + 16}`}
              stroke={palette.waterLight}
              strokeWidth="1"
              strokeOpacity="0.22"
            />
          </g>
        );
      })}

      {/* Horizontal frozen ice lines */}
      <g
        stroke={palette.waterLight}
        fill="none"
        opacity="0.28"
      >
        <path d="M0 870Q430 850 740 880T1500 860T1920 875" />
        <path d="M0 924Q400 910 850 935T1600 915T1920 930" />
        <path d="M200 980Q600 960 1000 985T1800 970" />
        <path d="M0 1030Q400 1010 900 1035T1920 1020" />
      </g>

      {/* Bright reflections */}
      <g
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.2"
      >
        <path d="M650 846H810" />
        <path d="M1010 875H1160" />
        <path d="M340 927H470" />
        <path d="M1390 955H1530" />
      </g>
    </g>
  );
});

// =========================================================
// MAIN LANDSCAPE SCENE
// =========================================================

const LandscapeScene = memo(function LandscapeScene({
  palette,
  theme,
  id,
}) {
  const buildings = [
    ...LEFT_BUILDINGS,
    ...RIGHT_BUILDINGS,
  ];

  return (
    <>
      <defs>
        {/* Sky gradient */}
        <linearGradient
          id={`${id}-sky`}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop offset="0%" stopColor={palette.skyTop} />
          <stop offset="55%" stopColor={palette.skyMiddle} />
          <stop offset="100%" stopColor={palette.skyBottom} />
        </linearGradient>

        {/* Atmospheric glow */}
        <radialGradient id={`${id}-sky-glow`}>
          <stop
            offset="0%"
            stopColor={palette.horizonGlow}
            stopOpacity="0.35"
          />
          <stop
            offset="100%"
            stopColor={palette.horizonGlow}
            stopOpacity="0"
          />
        </radialGradient>
      </defs>

      {/* =================================================
          SKY
      ================================================= */}

      <rect
        width="1920"
        height="1080"
        fill={`url(#${id}-sky)`}
      />

      <ellipse
        cx="960"
        cy="670"
        rx="950"
        ry="390"
        fill={`url(#${id}-sky-glow)`}
      />

      {/* Stars */}
      {theme === "dark" && (
        <g>
          {STAR_POINTS.map((star) => (
            <circle
              key={star.id}
              cx={star.x}
              cy={star.y}
              r={star.r}
              fill="#E0F2FE"
              opacity={star.opacity}
            />
          ))}
        </g>
      )}

      {/* Moon and sleigh */}
      <MoonAndSleigh palette={palette} />

      {/* Cyber network */}
      <CyberNetwork palette={palette} />

      {/* =================================================
          MOUNTAINS
      ================================================= */}

      <Mountains palette={palette} />

      {/* =================================================
          CITY SKYLINE
      ================================================= */}

      <g>
        {buildings.map((building, index) => (
          <CityBuilding
            key={`${theme}-${index}`}
            building={building}
            palette={palette}
            index={index}
          />
        ))}
      </g>

      {/* Skyline atmosphere */}
      <path
        d="M0 773Q450 730 960 773T1920 773"
        fill="none"
        stroke={palette.windows}
        strokeWidth="2"
        opacity="0.18"
      />

      {/* =================================================
          CABIN AND FOREST
      ================================================= */}

      <WinterCabin palette={palette} />

      <g>
        {FOREST_TREES.map((tree, index) => (
          <PineTree
            key={index}
            x={tree.x}
            y={tree.y}
            scale={tree.scale}
            palette={palette}
          />
        ))}
      </g>

      {/* =================================================
          BRIDGE AND FROZEN LAKE
      ================================================= */}

      <FrozenLake palette={palette} />

      <WinterBridge palette={palette} />

      {/* Foreground snow banks */}
      <path
        d="
          M0 925
          Q180 860 360 925
          Q580 965 800 925
          Q1080 870 1320 932
          Q1600 980 1920 908
          L1920 1080
          L0 1080
          Z
        "
        fill={palette.snow}
        opacity="0.83"
      />

      <path
        d="
          M0 975
          Q340 930 650 985
          Q1050 1030 1420 970
          Q1670 930 1920 970
        "
        fill="none"
        stroke={palette.snowShadow}
        strokeWidth="3"
        opacity="0.4"
      />
    </>
  );
});

// =========================================================
// WINTER LANDSCAPE
// Dark + Light theme composition
// =========================================================

const WinterLandscape = ({ className = "" }) => {
  const reactId = useId();
  const safeId = reactId.replace(/[^a-zA-Z0-9_-]/g, "");

  return (
    <div
      aria-hidden="true"
      className={[
        "pointer-events-none absolute inset-0 z-0",
        "overflow-hidden select-none",
        "bg-[#EAF5FF] dark:bg-[#02091D]",
        className,
      ].join(" ")}
    >
      <svg
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        {/* Light Mode — icy winter city */}
        <g className="opacity-100 dark:opacity-0">
          <LandscapeScene
            id={`${safeId}-light`}
            palette={PALETTES.light}
            theme="light"
          />
        </g>

        {/* Dark Mode — cyberpunk winter night */}
        <g className="opacity-0 dark:opacity-100">
          <LandscapeScene
            id={`${safeId}-dark`}
            palette={PALETTES.dark}
            theme="dark"
          />
        </g>
      </svg>

      {/* Center readability veil */}
      <div
        className="
          absolute
          inset-0
          bg-[radial-gradient(ellipse_at_center,rgba(239,248,255,0.32)_0%,rgba(239,248,255,0.06)_48%,transparent_78%)]
          dark:bg-[radial-gradient(ellipse_at_center,rgba(3,13,31,0.12)_0%,transparent_70%)]
        "
      />

      {/* Bottom atmospheric fade */}
      <div
        className="
          absolute
          inset-x-0
          bottom-0
          h-[16%]
          bg-gradient-to-t
          from-sky-100/30
          to-transparent
          dark:from-[#02091D]/45
        "
      />
    </div>
  );
};

export default memo(WinterLandscape);
