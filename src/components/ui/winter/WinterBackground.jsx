
import React, { memo } from "react";

import WINTER_BACKGROUND_CONFIG from "./data/winterBackgroundConfig";

import WinterLandscape from "./components/WinterLandscape";
import WinterAurora from "./components/WinterAurora";
import WinterDecorations from "./components/WinterDecorations";
import WinterSnowfall from "./components/WinterSnowfall";
import WinterBrand from "./components/WinterBrand";
import NewYearTransition from "./components/NewYearTransition";

// =========================================================
// FSOCIETY — WINTER BACKGROUND
// Main composition
// Dark / Light visual environment
// =========================================================

const WinterBackground = ({
  className = "",
  showBrand = true,
  showNewYear = true,
}) => {
  const config = WINTER_BACKGROUND_CONFIG ?? {};

  const enabled = config.enabled !== false;

  const layers = config.layers ?? {};

  if (!enabled) {
    return null;
  }

  // =======================================================
  // LAYER VISIBILITY
  // =======================================================

  const showLandscape = layers.landscape !== false;
  const showAurora = layers.aurora !== false;
  const showDecorations = layers.decorations !== false;
  const showSnowfall = layers.snowfall !== false;
  const showBrandLayer = layers.branding !== false;
  const showYearTransition = layers.yearTransition !== false;

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <div
      aria-hidden="true"
      className={[
        "pointer-events-none",
        "fixed",
        "inset-0",
        "z-0",
        "overflow-hidden",
        "select-none",
        "isolate",
        className,
      ].join(" ")}
    >
      {/* ================================================
          LAYER 1 — WINTER LANDSCAPE
          City / Mountains / Forest / Frozen Lake
      ================================================ */}

      {showLandscape && (
        <div className="absolute inset-0 z-0">
          <WinterLandscape />
        </div>
      )}

      {/* ================================================
          LAYER 2 — NORTHERN LIGHTS
          Aurora / Moon / Sky atmosphere
      ================================================ */}

      {showAurora && (
        <div className="absolute inset-0 z-[1]">
          <WinterAurora />
        </div>
      )}

      {/* ================================================
          LAYER 3 — WINTER DECORATIONS
          Snowmen / Christmas Tree / Gifts / Lights
      ================================================ */}

      {showDecorations && (
        <div className="absolute inset-0 z-[2]">
          <WinterDecorations />
        </div>
      )}

      {/* ================================================
          LAYER 4 — FSOCIETY BRAND
          Main watermark
      ================================================ */}

      {showBrand && showBrandLayer && (
        <div className="absolute inset-0 z-[4]">
          <WinterBrand position="center" />
        </div>
      )}

      {/* ================================================
          LAYER 5 — NEW YEAR TRANSITION
          2026 → 2027
      ================================================ */}

      {showNewYear && showYearTransition && (
        <div
          className="
            absolute
            bottom-[5%]
            right-[5%]
            z-[5]
            flex
            items-center
            justify-center
            sm:bottom-[7%]
            sm:right-[7%]
          "
        >
          <NewYearTransition />
        </div>
      )}

      {/* ================================================
          LAYER 6 — LIVE SNOWFALL
          Foreground snow particles
      ================================================ */}

      {showSnowfall && (
        <WinterSnowfall />
      )}
    </div>
  );
};

export default memo(WinterBackground);
