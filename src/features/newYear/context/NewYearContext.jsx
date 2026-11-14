import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

// =========================================================
// FSOCIETY — NEW YEAR CONTEXT
// =========================================================
//
// Location:
//
// src/features/newYear/context/NewYearContext.jsx
//
// Responsibilities:
//
// - Centralized winter settings
// - Snowfall preferences
// - Christmas lights preferences
// - Winter background preferences
// - Winter music preferences
// - Selected music track
// - Music volume
// - Fireworks trigger signal (non-persisted)
// - localStorage persistence & cross-tab sync
//
// IMPORTANT:
//
// - Does not modify ThemeContext.
// - Does not modify Redux.
// - Does not automatically play music.
// - All winter effects are disabled by default.
//
// =========================================================

// =========================================================
// CONSTANTS
// =========================================================

const STORAGE_KEY = "fsociety-winter-settings-v1";

// =========================================================
// DEFAULT SETTINGS
// =========================================================

const DEFAULT_SETTINGS = Object.freeze({
  snowfallEnabled: false,

  lightsEnabled: false,

  winterBackgroundEnabled: false,

  musicEnabled: false,

  selectedTrackId: "let-it-snow",

  volume: 0.7,
});

// =========================================================
// BOOLEAN SETTINGS
// =========================================================

const BOOLEAN_SETTINGS = [
  "snowfallEnabled",
  "lightsEnabled",
  "winterBackgroundEnabled",
  "musicEnabled",
];

// =========================================================
// SETTINGS NORMALIZER
// =========================================================

const normalizeSettings = (settings = {}) => {
  const safeSettings =
    settings &&
    typeof settings === "object" &&
    !Array.isArray(settings)
      ? settings
      : {};

  const normalizedVolume = Number(safeSettings.volume);

  return {
    snowfallEnabled:
      typeof safeSettings.snowfallEnabled === "boolean"
        ? safeSettings.snowfallEnabled
        : DEFAULT_SETTINGS.snowfallEnabled,

    lightsEnabled:
      typeof safeSettings.lightsEnabled === "boolean"
        ? safeSettings.lightsEnabled
        : DEFAULT_SETTINGS.lightsEnabled,

    winterBackgroundEnabled:
      typeof safeSettings.winterBackgroundEnabled === "boolean"
        ? safeSettings.winterBackgroundEnabled
        : DEFAULT_SETTINGS.winterBackgroundEnabled,

    musicEnabled:
      typeof safeSettings.musicEnabled === "boolean"
        ? safeSettings.musicEnabled
        : DEFAULT_SETTINGS.musicEnabled,

    selectedTrackId:
      typeof safeSettings.selectedTrackId === "string" &&
      safeSettings.selectedTrackId.trim()
        ? safeSettings.selectedTrackId
        : DEFAULT_SETTINGS.selectedTrackId,

    volume: Number.isFinite(normalizedVolume)
      ? Math.min(1, Math.max(0, normalizedVolume))
      : DEFAULT_SETTINGS.volume,
  };
};

// =========================================================
// LOAD SETTINGS
// =========================================================

const loadSettings = () => {
  if (typeof window === "undefined") {
    return { ...DEFAULT_SETTINGS };
  }

  try {
    const savedSettings = window.localStorage.getItem(STORAGE_KEY);

    if (!savedSettings) {
      return { ...DEFAULT_SETTINGS };
    }

    const parsedSettings = JSON.parse(savedSettings);

    return normalizeSettings(parsedSettings);
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
};

// =========================================================
// CONTEXT
// =========================================================

const NewYearContext = createContext(null);

// =========================================================
// PROVIDER
// =========================================================

export function NewYearProvider({ children }) {
  // =======================================================
  // SETTINGS STATE
  // =======================================================

  const [settings, setSettings] = useState(loadSettings);

  // =======================================================
  // FIREWORKS TRIGGER STATE (SESSION ONLY)
  // =======================================================

  const [fireworksCount, setFireworksCount] = useState(0);

  // =======================================================
  // SAVE SETTINGS
  // =======================================================

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(settings)
      );
    } catch {
      // Ignore storage errors.
      // Winter settings can still work in memory.
    }
  }, [settings]);

  // =======================================================
  // CROSS-TAB STORAGE SYNC
  // =======================================================

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const handleStorageChange = (event) => {
      if (event.key !== STORAGE_KEY) {
        return;
      }

      if (!event.newValue) {
        setSettings({ ...DEFAULT_SETTINGS });
        return;
      }

      try {
        const parsed = JSON.parse(event.newValue);
        setSettings(normalizeSettings(parsed));
      } catch {
        // Ignore malformed cross-tab payloads.
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // =======================================================
  // UPDATE SINGLE SETTING
  // =======================================================

  const setSetting = useCallback((key, value) => {
    if (
      !Object.prototype.hasOwnProperty.call(
        DEFAULT_SETTINGS,
        key
      )
    ) {
      return;
    }

    setSettings((previousSettings) =>
      normalizeSettings({
        ...previousSettings,
        [key]: value,
      })
    );
  }, []);

  // =======================================================
  // TOGGLE BOOLEAN SETTING
  // =======================================================

  const toggleSetting = useCallback((key) => {
    if (!BOOLEAN_SETTINGS.includes(key)) {
      return;
    }

    setSettings((previousSettings) => ({
      ...previousSettings,
      [key]: !Boolean(previousSettings[key]),
    }));
  }, []);

  // =======================================================
  // UPDATE MULTIPLE SETTINGS
  // =======================================================

  const updateSettings = useCallback((newSettings) => {
    if (
      !newSettings ||
      typeof newSettings !== "object" ||
      Array.isArray(newSettings)
    ) {
      return;
    }

    setSettings((previousSettings) =>
      normalizeSettings({
        ...previousSettings,
        ...newSettings,
      })
    );
  }, []);

  // =======================================================
  // RESET SETTINGS
  // =======================================================

  const resetSettings = useCallback(() => {
    setSettings({ ...DEFAULT_SETTINGS });
  }, []);

  // =======================================================
  // TRIGGER FIREWORKS
  // =======================================================

  const triggerFireworks = useCallback(() => {
    setFireworksCount((previousCount) => previousCount + 1);
  }, []);

  // =======================================================
  // CONTEXT VALUE
  // =======================================================

  const contextValue = useMemo(
    () => ({
      settings,

      setSetting,

      toggleSetting,

      updateSettings,

      resetSettings,

      fireworksCount,

      triggerFireworks,
    }),
    [
      settings,
      setSetting,
      toggleSetting,
      updateSettings,
      resetSettings,
      fireworksCount,
      triggerFireworks,
    ]
  );

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <NewYearContext.Provider value={contextValue}>
      {children}
    </NewYearContext.Provider>
  );
}

// =========================================================
// CUSTOM HOOK
// =========================================================

export function useNewYear() {
  const context = useContext(NewYearContext);

  if (!context) {
    throw new Error(
      "useNewYear must be used inside NewYearProvider."
    );
  }

  return context;
}

// =========================================================
// EXPORT
// =========================================================

export default NewYearContext;