
/**
 * =========================================================
 * FSOCIETY — WINTER BACKGROUND CONFIGURATION
 * Cyberpunk Winter × New Year 2027
 * =========================================================
 *
 * Central configuration for:
 * - WinterLandscape
 * - WinterAurora
 * - WinterGlow
 * - WinterFrost
 * - WinterDecorations
 * - WinterSnowfall
 * - WinterBrand
 * - NewYearTransition
 * - WinterBackground
 *
 * =========================================================
 */

// =========================================================
// DEEP FREEZE
// =========================================================

const deepFreeze = (value) => {
  if (
    value === null ||
    typeof value !== "object" ||
    Object.isFrozen(value)
  ) {
    return value;
  }

  Object.values(value).forEach(deepFreeze);

  return Object.freeze(value);
};

// =========================================================
// MAIN CONFIGURATION
// =========================================================

export const WINTER_BACKGROUND_CONFIG = deepFreeze({
  // =======================================================
  // GENERAL
  // =======================================================

  enabled: true,

  theme: {
    dark: true,
    light: true,
  },

  layers: {
    landscape: true,
    aurora: true,
    glow: true,
    frost: true,
    decorations: true,
    snowfall: true,
    branding: true,
    newYearTransition: true,
    snowdrifts: true,
  },

  // =======================================================
  // BRAND IDENTITY
  // =======================================================

  branding: {
    enabled: true,

    name: "FSOCIETY",
    subtitle: "Fix Society",
    tagline: "Fix • Share • Build Together",

    position: "center",

    colors: {
      primary: "#22D3EE",
      secondary: "#3B82F6",
      accent: "#8B5CF6",
    },

    watermark: {
      enabled: true,
      opacityLight: 0.09,
      opacityDark: 0.12,
    },

    animation: {
      enabled: true,
      pulseDuration: 9000,
    },
  },

  // =======================================================
  // GLOBAL COLOR PALETTE
  // =======================================================

  colors: {
    cyan: "#22D3EE",
    sky: "#38BDF8",
    blue: "#3B82F6",
    indigo: "#6366F1",
    violet: "#8B5CF6",

    emerald: "#10B981",
    ice: "#E0F2FE",
    snow: "#F8FAFC",

    gold: "#FDE68A",
    pink: "#F472B6",
    crimson: "#F43F5E",

    white: "#FFFFFF",
    dark: "#050A14",
  },

  // =======================================================
  // DARK THEME
  // =======================================================

  dark: {
    background: "#050A14",
    secondaryBackground: "#07162B",
    surface: "#0B1224",

    auroraOpacity: 0.62,
    glowOpacity: 0.72,
    frostOpacity: 0.24,
    decorationOpacity: 0.85,

    gridColor: "rgba(34, 211, 238, 0.11)",
    borderColor: "rgba(103, 232, 249, 0.18)",

    snowColor: "#E0F2FE",
    snowGlow: "rgba(34, 211, 238, 0.45)",
  },

  // =======================================================
  // LIGHT THEME
  // =======================================================

  light: {
    background: "#F4F8FF",
    secondaryBackground: "#EAF3FF",
    surface: "#FFFFFF",

    auroraOpacity: 0.42,
    glowOpacity: 0.45,
    frostOpacity: 0.42,
    decorationOpacity: 0.78,

    gridColor: "rgba(14, 116, 144, 0.08)",
    borderColor: "rgba(14, 116, 144, 0.15)",

    snowColor: "#FFFFFF",
    snowGlow: "rgba(56, 189, 248, 0.28)",
  },

  // =======================================================
  // LANDSCAPE
  // =======================================================

  landscape: {
    enabled: true,

    opacity: {
      light: 1,
      dark: 1,
    },

    atmosphere: {
      enabled: true,
      lightOpacity: 0.24,
      darkOpacity: 0.38,
    },

    animation: {
      enabled: true,
      respectReducedMotion: true,
    },
  },

  // =======================================================
  // AURORA — NORTHERN LIGHTS
  // =======================================================

  aurora: {
    enabled: true,

    colors: [
      "#22D3EE",
      "#38BDF8",
      "#3B82F6",
      "#6366F1",
      "#8B5CF6",
    ],

    opacity: {
      light: 0.42,
      dark: 0.62,
    },

    animation: {
      enabled: true,

      duration: 22000,
      secondaryDuration: 28000,
      tertiaryDuration: 18000,
      shimmerDuration: 11000,

      easing: "ease-in-out",

      blur: {
        mobile: 80,
        tablet: 110,
        desktop: 135,
      },
    },
  },

  // =======================================================
  // GLOW — CYBER NEON ATMOSPHERE
  // =======================================================

  glow: {
    enabled: true,

    colors: {
      primary: "#22D3EE",
      secondary: "#6366F1",
      accent: "#8B5CF6",
    },

    intensity: {
      light: 0.45,
      dark: 0.72,
    },

    animation: {
      enabled: true,

      pulseDuration: 9000,
      breatheDuration: 12000,
      scanDuration: 16000,
      beamDuration: 9500,

      easing: "ease-in-out",
    },
  },

  // =======================================================
  // FROST — FROZEN GLASS AND ICE CRYSTALS
  // =======================================================

  frost: {
    enabled: true,

    edgeEffect: true,
    cornerCrystals: true,
    glassEffect: true,

    opacity: {
      light: 0.42,
      dark: 0.24,
    },

    animation: {
      enabled: true,

      pulseDuration: 10000,
      driftDuration: 14000,
      shimmerDuration: 12000,
    },

    responsive: {
      mobile: {
        crystals: false,
        edgeWidth: 32,
      },

      tablet: {
        crystals: true,
        edgeWidth: 56,
      },

      desktop: {
        crystals: true,
        edgeWidth: 80,
      },
    },
  },

  // =======================================================
  // WINTER DECORATIONS
  // =======================================================

  decorations: {
    enabled: true,

    snowmen: {
      enabled: true,

      count: 1,

      animation: true,
      floatDuration: 7000,

      position: "bottom-left",

      mobile: {
        enabled: true,
        scale: 0.55,
      },

      desktop: {
        enabled: true,
        scale: 1,
      },
    },

    christmasTree: {
      enabled: true,

      count: 1,

      animation: true,
      floatDuration: 6500,

      position: "bottom-right",

      mobile: {
        enabled: true,
        scale: 0.55,
      },

      desktop: {
        enabled: true,
        scale: 1,
      },
    },

    ornaments: {
      enabled: true,

      count: 2,

      animation: true,
      swingDuration: 6000,
    },

    stars: {
      enabled: true,

      count: 5,

      twinkle: true,
      twinkleDuration: 3200,
    },

    gifts: {
      enabled: true,

      count: 3,
    },

    iceCrystals: {
      enabled: true,

      count: 3,
    },
  },

  // =======================================================
  // SNOWFALL
  // =======================================================

  snowfall: {
    enabled: true,

    animation: {
      enabled: true,

      respectReducedMotion: true,

      far: {
        duration: 22000,
        opacity: 0.42,
      },

      near: {
        duration: 12000,
        opacity: 0.82,
      },
    },

    particles: {
      mobile: 45,
      tablet: 75,
      desktop: 110,
    },

    atmosphere: {
      enabled: true,
      bottomOpacity: 0.24,
    },
  },

  // =======================================================
  // NEW YEAR — 2026 → 2027
  // =======================================================

  yearTransition: {
    enabled: true,

    fromYear: "2026",
    toYear: "2027",

    prefix: "202",
    fromDigit: "6",
    toDigit: "7",

    changingDigitIndex: 3,

    style: "cyber-glitch-grid",

    placement: {
      position: "bottom-right",

      mobile: {
        bottom: 12,
        right: 12,
        fontSize: "1.75rem",
      },

      tablet: {
        bottom: 24,
        right: 28,
        fontSize: "2.5rem",
      },

      desktop: {
        bottom: 36,
        right: 48,
        fontSize: "3.5rem",
      },
    },

    animation: {
      enabled: true,
      loop: true,

      cycleDurationMs: 6800,
      duration: 6800,

      delay: 400,

      glitchDuration: 1100,
      gridDuration: 1800,
      settleDuration: 900,

      scanlines: true,
      digitalNoise: true,
      gridFragments: true,
      flicker: true,
      glow: true,
    },

    grid: {
      columns: 6,
      rows: 8,

      gap: 2,

      fragmentAnimation: true,
      randomMovement: true,
      reconstruction: true,
    },

    colors: {
      primary: "#22D3EE",
      secondary: "#3B82F6",
      accent: "#8B5CF6",

      success: "#34D399",
      glitch: "#F43F5E",
    },

    typography: {
      fontFamily:
        "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",

      weight: 900,
      letterSpacing: "-0.04em",
    },

    accessibility: {
      respectReducedMotion: true,
      announceFinalYear: true,
    },
  },

  // =======================================================
  // SNOWDRIFTS — FROZEN GROUND
  // =======================================================

  snowdrifts: {
    enabled: true,

    height: {
      mobile: 76,
      tablet: 112,
      desktop: 160,
    },

    light: {
      primary: "#DBEAFE",
      secondary: "#F0F9FF",

      primaryOpacity: 0.52,
      secondaryOpacity: 0.78,
    },

    dark: {
      primary: "#0B223D",
      secondary: "#07162B",

      primaryOpacity: 0.45,
      secondaryOpacity: 0.82,

      highlight: "#22D3EE",
      highlightOpacity: 0.22,
    },
  },

  // =======================================================
  // RESPONSIVE SETTINGS
  // =======================================================

  responsive: {
    breakpoints: {
      mobile: 640,
      tablet: 1024,
      desktop: 1280,
      largeDesktop: 1536,
    },

    mobile: {
      decorations: true,

      largeCrystals: false,

      auroraBlur: 80,
      glowBlur: 95,

      reduceVisualIntensity: true,
    },

    tablet: {
      decorations: true,

      largeCrystals: true,

      auroraBlur: 110,
      glowBlur: 120,

      reduceVisualIntensity: false,
    },

    desktop: {
      decorations: true,

      largeCrystals: true,

      auroraBlur: 135,
      glowBlur: 145,

      reduceVisualIntensity: false,
    },
  },

  // =======================================================
  // PERFORMANCE
  // =======================================================

  performance: {
    respectReducedMotion: true,

    useHardwareAcceleration: true,

    disableAnimationsWhenHidden: true,

    avoidHeavyFiltersOnMobile: true,

    pointerEvents: "none",

    decorativeLayers: true,

    maxParticles: {
      mobile: 45,
      tablet: 75,
      desktop: 110,
    },
  },
});

// =========================================================
// CONFIG HELPERS
// =========================================================

/**
 * Checks whether the entire background and
 * a particular visual layer are enabled.
 *
 * @param {string} layerName
 * @returns {boolean}
 */

export const isWinterLayerEnabled = (layerName) => {
  if (!WINTER_BACKGROUND_CONFIG.enabled) {
    return false;
  }

  if (
    !layerName ||
    typeof layerName !== "string"
  ) {
    return false;
  }

  if (
    !Object.prototype.hasOwnProperty.call(
      WINTER_BACKGROUND_CONFIG.layers,
      layerName
    )
  ) {
    return false;
  }

  return (
    WINTER_BACKGROUND_CONFIG.layers[layerName] === true
  );
};

// =========================================================
// DEFAULT EXPORT
// =========================================================

export default WINTER_BACKGROUND_CONFIG;
