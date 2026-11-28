
import React, {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useNewYear,
} from "../context/NewYearContext";

// =========================================================
// FSOCIETY — REALISTIC SNOWFALL & CYBER FIREWORKS
// =========================================================
//
// Location:
//
// src/features/newYear/components/Snowfall.jsx
//
// Responsibilities:
//
// - Multi-layered realistic snowfall (soft snow puffs,
//   rotating 6-point ice crystals, & distant depth flakes)
// - Rich multi-style fireworks (Dual-Ring, Willow, Chrysanthemum)
// - Ascending rocket ember trails & explosion shockwave rings
// - Cached offscreen sprites for high FPS on mobile & desktop
// - Full Light & Dark theme color adaptation
// - Reduced motion & page visibility optimization
// - Zero CPU usage when idle
//
// IMPORTANT:
//
// - Pointer events are disabled.
// - Snowfall follows settings.snowfallEnabled.
// - Fireworks listen to NewYearContext (fireworksCount)
//   and "fsociety:launch-fireworks" event.
//
// =========================================================

// =========================================================
// CONSTANTS
// =========================================================

const MAX_FLAKES = 115;
const MIN_FLAKES = 22;
const FLAKE_AREA = 13500;
const MAX_PIXEL_RATIO = 1.5;

const DARK_FIREWORK_PALETTES = [
  { primary: "#22d3ee", secondary: "#a855f7", core: "#ffffff" }, // Cyber Cyan + Violet
  { primary: "#38bdf8", secondary: "#fde047", core: "#ffffff" }, // Ice Sky + Gold
  { primary: "#818cf8", secondary: "#2dd4bf", core: "#f8fafc" }, // Indigo + Mint
  { primary: "#fb7185", secondary: "#fbbf24", core: "#fff1f2" }, // Rose + Gold
  { primary: "#c084fc", secondary: "#38bdf8", core: "#ffffff" }, // Violet + Sky
];

const LIGHT_FIREWORK_PALETTES = [
  { primary: "#0891b2", secondary: "#7c3aed", core: "#ecfeff" }, // Deep Cyan + Violet
  { primary: "#2563eb", secondary: "#d97706", core: "#eff6ff" }, // Cobalt + Amber
  { primary: "#4f46e5", secondary: "#0d9488", core: "#eef2ff" }, // Indigo + Teal
  { primary: "#e11d48", secondary: "#ea580c", core: "#fff1f2" }, // Crimson + Orange
  { primary: "#9333ea", secondary: "#0284c7", core: "#faf5ff" }, // Royal Purple + Blue
];

const BURST_STYLES = ["chrysanthemum", "dualRing", "willow"];

// =========================================================
// HELPERS
// =========================================================

const getParticleCount = (width, height) => {
  const calculatedCount = Math.floor(
    (width * height) / FLAKE_AREA
  );

  return Math.max(
    MIN_FLAKES,
    Math.min(MAX_FLAKES, calculatedCount)
  );
};

const isDarkThemeActive = () => {
  if (typeof document === "undefined") {
    return false;
  }

  return document.documentElement.classList.contains("dark");
};

// =========================================================
// OFFSCREEN SPRITE GENERATORS (REALISTIC SNOW)
// =========================================================

const createSoftPuffSprite = (isDark) => {
  const size = 28;
  const offscreen = document.createElement("canvas");
  offscreen.width = size;
  offscreen.height = size;
  const ctx = offscreen.getContext("2d");

  if (!ctx) {
    return offscreen;
  }

  const half = size / 2;
  const grad = ctx.createRadialGradient(
    half,
    half,
    1,
    half,
    half,
    half - 1
  );

  if (isDark) {
    grad.addColorStop(0, "rgba(255, 255, 255, 1)");
    grad.addColorStop(0.42, "rgba(224, 247, 255, 0.85)");
    grad.addColorStop(0.75, "rgba(186, 230, 253, 0.25)");
    grad.addColorStop(1, "rgba(186, 230, 253, 0)");
  } else {
    // LIGHT MODE — ICE BLUE SNOW
    grad.addColorStop(0, "rgba(169, 213, 244, 0.98)");
    grad.addColorStop(0.45, "rgba(146, 199, 236, 0.86)");
    grad.addColorStop(0.75, "rgba(117, 174, 222, 0.36)");
    grad.addColorStop(1, "rgba(117, 174, 222, 0)");
  }

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(half, half, half - 1, 0, Math.PI * 2);
  ctx.fill();

  return offscreen;
};

const createCrystalSprite = (isDark) => {
  const size = 36;
  const offscreen = document.createElement("canvas");
  offscreen.width = size;
  offscreen.height = size;
  const ctx = offscreen.getContext("2d");

  if (!ctx) {
    return offscreen;
  }

  const half = size / 2;
  const armLen = half - 4;

  ctx.translate(half, half);
  ctx.lineCap = "round";

  if (!isDark) {
    // LIGHT MODE — SOFT BLUE CRYSTAL SHADOW
    ctx.shadowColor = "rgba(89, 156, 210, 0.42)";
    ctx.shadowBlur = 3;
  } else {
    ctx.shadowColor = "rgba(165, 243, 252, 0.6)";
    ctx.shadowBlur = 4;
  }

  ctx.strokeStyle = isDark
    ? "rgba(240, 250, 255, 0.96)"
    : "rgba(129, 181, 222, 0.94)";
  ctx.lineWidth = 1.45;

  for (let i = 0; i < 6; i += 1) {
    ctx.save();
    ctx.rotate((Math.PI / 3) * i);

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -armLen);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-3.4, -armLen * 0.68);
    ctx.lineTo(0, -armLen * 0.5);
    ctx.lineTo(3.4, -armLen * 0.68);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-2.2, -armLen * 0.38);
    ctx.lineTo(0, -armLen * 0.25);
    ctx.lineTo(2.2, -armLen * 0.38);
    ctx.stroke();

    ctx.restore();
  }

  ctx.fillStyle = isDark
    ? "rgba(255, 255, 255, 0.95)"
    : "rgba(158, 205, 239, 0.96)";
  ctx.beginPath();
  ctx.arc(0, 0, 1.8, 0, Math.PI * 2);
  ctx.fill();

  return offscreen;
};

const createSnowSpriteSet = () => ({
  dark: {
    puff: createSoftPuffSprite(true),
    crystal: createCrystalSprite(true),
  },
  light: {
    puff: createSoftPuffSprite(false),
    crystal: createCrystalSprite(false),
  },
});

// =========================================================
// CREATE SNOWFLAKE (3 DEPTH LAYERS)
// =========================================================

const createSnowflake = (width, height, initial = false) => {
  const roll = Math.random();
  const kind =
    roll < 0.24 ? "crystal" : roll < 0.78 ? "puff" : "micro";

  let size;
  let speedY;
  let opacity;

  if (kind === "crystal") {
    size = 9 + Math.random() * 8;
    speedY = 0.45 + Math.random() * 0.65;
    opacity = 0.55 + Math.random() * 0.38;
  } else if (kind === "puff") {
    size = 4.5 + Math.random() * 6.5;
    speedY = 0.5 + Math.random() * 0.85;
    opacity = 0.42 + Math.random() * 0.48;
  } else {
    size = 2 + Math.random() * 2.2;
    speedY = 0.28 + Math.random() * 0.4;
    opacity = 0.28 + Math.random() * 0.32;
  }

  return {
    kind,
    x: Math.random() * width,
    y: initial
      ? Math.random() * height
      : -size - Math.random() * 24,
    size,
    speedY,
    speedX: (Math.random() - 0.5) * 0.35,
    opacity,
    sway: 0.3 + Math.random() * 0.75,
    phase: Math.random() * Math.PI * 2,
    angle: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.018,
  };
};

// =========================================================
// CREATE FIREWORK ROCKET
// =========================================================

const createRocket = (width, height, isDark, styleIndex) => {
  const palettes = isDark
    ? DARK_FIREWORK_PALETTES
    : LIGHT_FIREWORK_PALETTES;

  const palette =
    palettes[Math.floor(Math.random() * palettes.length)];

  const startX = width * (0.14 + Math.random() * 0.72);
  const targetY = Math.max(
    90,
    height * (0.15 + Math.random() * 0.31)
  );

  return {
    x: startX,
    y: height + 10,
    trail: [{ x: startX, y: height + 10 }],
    vx: (Math.random() - 0.5) * 2.4,
    vy: -(
      Math.sqrt(2 * 0.165 * (height - targetY)) *
      (0.94 + Math.random() * 0.12)
    ),
    targetY,
    palette,
    style: BURST_STYLES[styleIndex % BURST_STYLES.length],
  };
};

// =========================================================
// CREATE FIREWORK EXPLOSION (MULTI-STYLE SPARKS + SHOCKWAVE)
// =========================================================

const createExplosion = (
  x,
  y,
  palette,
  style,
  width
) => {
  const isCompact = width < 640;
  const particles = [];

  if (style === "dualRing") {
    const outerCount = isCompact ? 34 : 48;
    const innerCount = isCompact ? 18 : 26;

    for (let i = 0; i < outerCount; i += 1) {
      const angle =
        (Math.PI * 2 * i) / outerCount +
        (Math.random() - 0.5) * 0.08;
      const speed =
        (isCompact ? 3.8 : 5.0) + Math.random() * 1.1;

      particles.push({
        x,
        y,
        trail: [{ x, y }],
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        decay: 0.013 + Math.random() * 0.008,
        gravity: 0.045,
        drag: 0.972,
        radius: 1.6 + Math.random() * 1.1,
        color: palette.primary,
        coreColor: palette.core,
        twinkle: Math.random() > 0.45,
      });
    }

    for (let i = 0; i < innerCount; i += 1) {
      const angle =
        (Math.PI * 2 * i) / innerCount +
        (Math.random() - 0.5) * 0.12;
      const speed =
        (isCompact ? 1.9 : 2.6) + Math.random() * 0.9;

      particles.push({
        x,
        y,
        trail: [{ x, y }],
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        decay: 0.015 + Math.random() * 0.009,
        gravity: 0.042,
        drag: 0.97,
        radius: 1.4 + Math.random() * 1.0,
        color: palette.secondary,
        coreColor: palette.core,
        twinkle: true,
      });
    }
  } else if (style === "willow") {
    const count = isCompact ? 36 : 54;

    for (let i = 0; i < count; i += 1) {
      const angle =
        (Math.PI * 2 * i) / count +
        (Math.random() - 0.5) * 0.25;
      const speed =
        (isCompact ? 2.2 : 2.8) +
        Math.random() * (isCompact ? 3.0 : 4.2);

      particles.push({
        x,
        y,
        trail: [{ x, y }],
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.5,
        alpha: 1,
        decay: 0.009 + Math.random() * 0.007,
        gravity: 0.068,
        drag: 0.968,
        radius: 1.5 + Math.random() * 1.2,
        color: i % 3 === 0 ? palette.secondary : palette.primary,
        coreColor: palette.core,
        twinkle: Math.random() > 0.35,
      });
    }
  } else {
    // Chrysanthemum full star burst
    const count = isCompact ? 42 : 64;

    for (let i = 0; i < count; i += 1) {
      const angle =
        (Math.PI * 2 * i) / count +
        (Math.random() - 0.5) * 0.18;
      const speed =
        (isCompact ? 1.8 : 2.3) +
        Math.random() * (isCompact ? 4.2 : 5.8);

      particles.push({
        x,
        y,
        trail: [{ x, y }],
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        decay: 0.012 + Math.random() * 0.01,
        gravity: 0.046,
        drag: 0.974,
        radius: 1.4 + Math.random() * 1.4,
        color: i % 4 === 0 ? palette.secondary : palette.primary,
        coreColor: palette.core,
        twinkle: Math.random() > 0.5,
      });
    }
  }

  const shockwave = {
    x,
    y,
    radius: 6,
    maxRadius: isCompact ? 46 : 66,
    alpha: 0.52,
    color: palette.primary,
  };

  return {
    particles,
    shockwave,
  };
};

// =========================================================
// COMPONENT
// =========================================================

function Snowfall() {
  // =======================================================
  // NEW YEAR CONTEXT
  // =======================================================

  const {
    settings,
    fireworksCount = 0,
  } = useNewYear();

  // =======================================================
  // LOCAL STATE & REFS
  // =======================================================

  const [isFireworksActive, setIsFireworksActive] =
    useState(false);

  const canvasRef = useRef(null);
  const spriteSetRef = useRef(null);

  const snowfallEnabledRef = useRef(settings.snowfallEnabled);
  snowfallEnabledRef.current = settings.snowfallEnabled;

  const isFireworksActiveRef = useRef(isFireworksActive);
  isFireworksActiveRef.current = isFireworksActive;

  const pendingSalvosRef = useRef(0);
  const lastTriggerTimeRef = useRef(0);
  const spawnSalvoHandlerRef = useRef(null);
  const startAnimationRef = useRef(null);
  const prevFireworksCountRef = useRef(fireworksCount);

  // =======================================================
  // UNIFIED FIREWORK TRIGGER (DEDUPED)
  // =======================================================

  const enqueueFireworks = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }

    const motionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    if (motionQuery.matches) {
      return;
    }

    const now = performance.now();

    if (now - lastTriggerTimeRef.current < 80) {
      return;
    }

    lastTriggerTimeRef.current = now;
    isFireworksActiveRef.current = true;
    setIsFireworksActive(true);

    if (typeof spawnSalvoHandlerRef.current === "function") {
      spawnSalvoHandlerRef.current();
      startAnimationRef.current?.();
    } else {
      pendingSalvosRef.current += 1;
    }
  }, []);

  // =======================================================
  // LISTEN TO CONTEXT FIREWORKS COUNT
  // =======================================================

  useEffect(() => {
    if (fireworksCount > prevFireworksCountRef.current) {
      prevFireworksCountRef.current = fireworksCount;
      enqueueFireworks();
    }
  }, [fireworksCount, enqueueFireworks]);

  // =======================================================
  // LISTEN TO CUSTOM FIREWORKS EVENT
  // =======================================================

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const handleLaunchEvent = () => {
      enqueueFireworks();
    };

    window.addEventListener(
      "fsociety:launch-fireworks",
      handleLaunchEvent
    );

    return () => {
      window.removeEventListener(
        "fsociety:launch-fireworks",
        handleLaunchEvent
      );
    };
  }, [enqueueFireworks]);

  // =======================================================
  // CANVAS ENGINE (SNOWFALL + FIREWORKS)
  // =======================================================

  const hasCanvas =
    Boolean(settings.snowfallEnabled) || isFireworksActive;

  useEffect(() => {
    if (!hasCanvas) {
      return undefined;
    }

    const canvas = canvasRef.current;

    if (!canvas) {
      return undefined;
    }

    const context = canvas.getContext("2d", {
      alpha: true,
    });

    if (!context) {
      return undefined;
    }

    if (!spriteSetRef.current) {
      spriteSetRef.current = createSnowSpriteSet();
    }

    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let snowflakes = [];
    let rockets = [];
    let sparks = [];
    let shockwaves = [];
    let activeSalvoTimers = 0;
    let salvoTimeouts = [];
    let animationFrameId = null;
    let lastFrameTime = 0;
    let isDestroyed = false;

    const motionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    // =====================================================
    // SNOWFLAKE INITIALIZATION
    // =====================================================

    const syncSnowflakes = (forceReset = false) => {
      if (!snowfallEnabledRef.current) {
        snowflakes = [];
        return;
      }

      const targetCount = getParticleCount(width, height);

      if (forceReset || snowflakes.length === 0) {
        snowflakes = Array.from(
          { length: targetCount },
          () => createSnowflake(width, height, true)
        );
        return;
      }

      if (snowflakes.length < targetCount) {
        const extra = targetCount - snowflakes.length;
        for (let i = 0; i < extra; i += 1) {
          snowflakes.push(createSnowflake(width, height, true));
        }
      } else if (snowflakes.length > targetCount) {
        snowflakes.length = targetCount;
      }
    };

    // =====================================================
    // SPAWN FIREWORK SALVO
    // =====================================================

    const spawnSalvo = () => {
      if (
        isDestroyed ||
        motionQuery.matches ||
        width <= 0 ||
        height <= 0
      ) {
        return;
      }

      const rocketCount = width < 640 ? 4 : 6;
      const isDark = isDarkThemeActive();

      for (let i = 0; i < rocketCount; i += 1) {
        activeSalvoTimers += 1;

        const delay = i * 155;
        const timerId = window.setTimeout(() => {
          activeSalvoTimers = Math.max(
            0,
            activeSalvoTimers - 1
          );

          if (!isDestroyed && !document.hidden) {
            rockets.push(createRocket(width, height, isDark, i));
          }
        }, delay);

        salvoTimeouts.push(timerId);
      }
    };

    spawnSalvoHandlerRef.current = spawnSalvo;

    // =====================================================
    // RESIZE CANVAS
    // =====================================================

    const resizeCanvas = () => {
      if (isDestroyed) {
        return;
      }

      const nextWidth = window.innerWidth;
      const nextHeight = window.innerHeight;
      const widthChanged = Math.abs(nextWidth - width) > 24;

      width = nextWidth;
      height = nextHeight;

      pixelRatio = Math.min(
        window.devicePixelRatio || 1,
        MAX_PIXEL_RATIO
      );

      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      context.setTransform(
        pixelRatio,
        0,
        0,
        pixelRatio,
        0,
        0
      );

      syncSnowflakes(widthChanged);
    };

    // =====================================================
    // DRAW FRAME (REALISTIC SNOW + RICH FIREWORKS)
    // =====================================================

    const drawFrame = (time, delta) => {
      context.clearRect(0, 0, width, height);

      const movement = delta / 16.67;
      const isDark = isDarkThemeActive();
      const themeSprites = isDark
        ? spriteSetRef.current.dark
        : spriteSetRef.current.light;

      // 1. DRAW REALISTIC SNOWFLAKES

      if (snowfallEnabledRef.current) {
        if (snowflakes.length === 0) {
          syncSnowflakes(true);
        }

        const globalWind = Math.sin(time * 0.00035) * 0.22;

        for (let i = 0; i < snowflakes.length; i += 1) {
          const flake = snowflakes[i];

          flake.y += flake.speedY * movement;
          flake.x +=
            (flake.speedX +
              globalWind +
              Math.sin(time * 0.0011 + flake.phase) *
                flake.sway *
                0.24) *
            movement;

          if (flake.kind === "crystal") {
            flake.angle += flake.spin * movement;
          }

          if (flake.y > height + flake.size) {
            Object.assign(flake, createSnowflake(width, height));
            flake.x = Math.random() * width;
          }

          if (flake.x < -flake.size) {
            flake.x = width + flake.size;
          } else if (flake.x > width + flake.size) {
            flake.x = -flake.size;
          }

          context.save();
          context.globalAlpha = flake.opacity;

          if (flake.kind === "crystal") {
            context.translate(flake.x, flake.y);
            context.rotate(flake.angle);
            const half = flake.size / 2;
            context.drawImage(
              themeSprites.crystal,
              -half,
              -half,
              flake.size,
              flake.size
            );
          } else if (flake.kind === "puff") {
            const half = flake.size / 2;
            context.drawImage(
              themeSprites.puff,
              flake.x - half,
              flake.y - half,
              flake.size,
              flake.size
            );
          } else {
            context.beginPath();
            context.arc(
              flake.x,
              flake.y,
              flake.size * 0.5,
              0,
              Math.PI * 2
            );
            context.fillStyle = isDark
              ? "rgba(235, 248, 255, 0.9)"
              : "rgba(132, 184, 224, 0.88)";
            context.fill();
          }

          context.restore();
        }
      } else if (snowflakes.length > 0) {
        snowflakes = [];
      }

      // 2. UPDATE & DRAW SHOCKWAVE RINGS

      for (let i = shockwaves.length - 1; i >= 0; i -= 1) {
        const ring = shockwaves[i];

        ring.radius += (ring.maxRadius - ring.radius) * 0.18 * movement;
        ring.alpha -= 0.032 * movement;

        if (ring.alpha <= 0.02) {
          shockwaves.splice(i, 1);
          continue;
        }

        context.save();
        context.globalAlpha = ring.alpha;
        context.beginPath();
        context.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2);
        context.strokeStyle = ring.color;
        context.lineWidth = 2.2;
        context.stroke();
        context.restore();
      }

      // 3. UPDATE & DRAW FIREWORK ROCKETS

      for (let i = rockets.length - 1; i >= 0; i -= 1) {
        const rocket = rockets[i];

        rocket.x += rocket.vx * movement;
        rocket.y += rocket.vy * movement;
        rocket.vy += 0.165 * movement;

        rocket.trail.push({ x: rocket.x, y: rocket.y });
        if (rocket.trail.length > 6) {
          rocket.trail.shift();
        }

        // Rocket luminous tail
        if (rocket.trail.length > 1) {
          context.save();
          context.lineCap = "round";
          context.lineJoin = "round";

          context.beginPath();
          context.moveTo(rocket.trail[0].x, rocket.trail[0].y);
          for (let t = 1; t < rocket.trail.length; t += 1) {
            context.lineTo(rocket.trail[t].x, rocket.trail[t].y);
          }

          context.globalAlpha = 0.35;
          context.strokeStyle = rocket.palette.primary;
          context.lineWidth = 5;
          context.stroke();

          context.globalAlpha = 0.95;
          context.strokeStyle = rocket.palette.core;
          context.lineWidth = 2;
          context.stroke();
          context.restore();
        }

        // Occasional ascending ember spark
        if (Math.random() > 0.55) {
          sparks.push({
            x: rocket.x,
            y: rocket.y,
            trail: [{ x: rocket.x, y: rocket.y }],
            vx: (Math.random() - 0.5) * 0.7,
            vy: 0.6 + Math.random() * 0.9,
            alpha: 0.75,
            decay: 0.045,
            gravity: 0.03,
            drag: 0.95,
            radius: 1.1,
            color: rocket.palette.secondary,
            coreColor: rocket.palette.core,
            twinkle: false,
          });
        }

        if (rocket.vy >= -0.55 || rocket.y <= rocket.targetY) {
          const { particles, shockwave } = createExplosion(
            rocket.x,
            rocket.y,
            rocket.palette,
            rocket.style,
            width
          );

          for (let j = 0; j < particles.length; j += 1) {
            sparks.push(particles[j]);
          }

          shockwaves.push(shockwave);
          rockets.splice(i, 1);
        }
      }

      // 4. UPDATE & DRAW FIREWORK SPARKS (SMOOTH MULTI-POINT TRAILS)

      for (let i = sparks.length - 1; i >= 0; i -= 1) {
        const spark = sparks[i];

        const drag = Math.pow(spark.drag, movement);
        spark.vx *= drag;
        spark.vy = spark.vy * drag + spark.gravity * movement;

        spark.x += spark.vx * movement;
        spark.y += spark.vy * movement;
        spark.alpha -= spark.decay * movement;

        if (spark.alpha <= 0.02) {
          sparks.splice(i, 1);
          continue;
        }

        spark.trail.push({ x: spark.x, y: spark.y });
        if (spark.trail.length > 5) {
          spark.trail.shift();
        }

        const flickerAlpha =
          spark.twinkle && Math.random() > 0.74
            ? spark.alpha * 0.42
            : spark.alpha;

        const safeAlpha = Math.max(0, Math.min(1, flickerAlpha));

        context.save();
        context.lineCap = "round";
        context.lineJoin = "round";

        if (spark.trail.length > 1) {
          context.beginPath();
          context.moveTo(spark.trail[0].x, spark.trail[0].y);
          for (let t = 1; t < spark.trail.length; t += 1) {
            context.lineTo(spark.trail[t].x, spark.trail[t].y);
          }

          // Soft neon outer aura
          context.globalAlpha = safeAlpha * (isDark ? 0.32 : 0.45);
          context.strokeStyle = spark.color;
          context.lineWidth = spark.radius * 2.3;
          context.stroke();

          // Crisp inner spark trail
          context.globalAlpha = safeAlpha;
          context.strokeStyle = spark.color;
          context.lineWidth = spark.radius;
          context.stroke();
        }

        // Bright star head
        context.globalAlpha = safeAlpha;
        context.beginPath();
        context.arc(
          spark.x,
          spark.y,
          spark.radius * 0.65,
          0,
          Math.PI * 2
        );
        context.fillStyle = spark.coreColor;
        context.fill();

        context.restore();
      }
    };

    // =====================================================
    // ANIMATION LOOP
    // =====================================================

    const animate = (time) => {
      if (isDestroyed) {
        return;
      }

      if (document.hidden || motionQuery.matches) {
        animationFrameId = null;
        lastFrameTime = 0;
        return;
      }

      const delta = lastFrameTime
        ? Math.min(time - lastFrameTime, 33.33)
        : 16.67;

      lastFrameTime = time;

      drawFrame(time, delta);

      const fireworksRemaining =
        rockets.length > 0 ||
        sparks.length > 0 ||
        shockwaves.length > 0 ||
        activeSalvoTimers > 0;

      if (!fireworksRemaining && isFireworksActiveRef.current) {
        isFireworksActiveRef.current = false;
        setIsFireworksActive(false);
      }

      if (!snowfallEnabledRef.current && !fireworksRemaining) {
        animationFrameId = null;
        lastFrameTime = 0;
        context.clearRect(0, 0, width, height);
        return;
      }

      animationFrameId = window.requestAnimationFrame(animate);
    };

    const startAnimation = () => {
      if (
        isDestroyed ||
        motionQuery.matches ||
        document.hidden ||
        animationFrameId !== null
      ) {
        return;
      }

      lastFrameTime = 0;
      animationFrameId = window.requestAnimationFrame(animate);
    };

    startAnimationRef.current = startAnimation;

    const stopAnimation = () => {
      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }

      lastFrameTime = 0;
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAnimation();
      } else {
        startAnimation();
      }
    };

    const handleMotionChange = () => {
      if (motionQuery.matches) {
        stopAnimation();
        rockets = [];
        sparks = [];
        shockwaves = [];
        isFireworksActiveRef.current = false;
        setIsFireworksActive(false);
        context.clearRect(0, 0, width, height);
      } else {
        startAnimation();
      }
    };

    const handleResize = () => {
      resizeCanvas();

      if (!motionQuery.matches) {
        startAnimation();
      }
    };

    // =====================================================
    // INITIALIZATION
    // =====================================================

    resizeCanvas();

    if (pendingSalvosRef.current > 0) {
      const queued = pendingSalvosRef.current;
      pendingSalvosRef.current = 0;
      for (let i = 0; i < queued; i += 1) {
        spawnSalvo();
      }
    }

    window.addEventListener("resize", handleResize, {
      passive: true,
    });
    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );
    motionQuery.addEventListener("change", handleMotionChange);

    startAnimation();

    // =====================================================
    // CLEANUP
    // =====================================================

    return () => {
      isDestroyed = true;
      spawnSalvoHandlerRef.current = null;
      startAnimationRef.current = null;

      stopAnimation();

      salvoTimeouts.forEach((timerId) => {
        window.clearTimeout(timerId);
      });
      salvoTimeouts = [];

      window.removeEventListener("resize", handleResize);
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
      motionQuery.removeEventListener(
        "change",
        handleMotionChange
      );

      context.clearRect(0, 0, width, height);
      snowflakes = [];
      rockets = [];
      sparks = [];
      shockwaves = [];
    };
  }, [hasCanvas]);

  // =======================================================
  // IDLE STATE
  // =======================================================

  if (!hasCanvas) {
    return null;
  }

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`
        pointer-events-none
        fixed
        inset-0
        block
        h-[100dvh]
        w-screen
        ${isFireworksActive ? "z-[85]" : "z-[60]"}
      `}
    />
  );
}

// =========================================================
// EXPORT
// =========================================================

export default memo(Snowfall);
