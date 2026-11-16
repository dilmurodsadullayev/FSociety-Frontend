
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
// - Automatic winter mode defaults
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
// - Audio playback lifecycle is managed externally.
// - All winter modes are enabled by default.
// - User preferences are persisted after initialization.
//
// =========================================================

// =========================================================
// CONSTANTS
// =========================================================

const STORAGE_KEY = "fsociety-winter-settings-v1";

const AUTO_ENABLE_MIGRATION_KEY =
    "fsociety-winter-auto-mode-initialized-v1";

// =========================================================
// DEFAULT SETTINGS
// =========================================================

const DEFAULT_SETTINGS = Object.freeze({
    snowfallEnabled: true,

    lightsEnabled: true,

    winterBackgroundEnabled: true,

    musicEnabled: true,

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

    const normalizedVolume = Number(
        safeSettings.volume
    );

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
// AUTOMATIC WINTER MODE MIGRATION
// =========================================================
//
// Existing users may already have false values saved
// in localStorage from the previous version.
//
// On the first launch after this update:
//
// - Enable snowfall.
// - Enable Christmas lights.
// - Enable winter background.
// - Enable music.
//
// Preserve the selected track and volume.
//
// After this one-time migration, respect the user's
// own preferences on subsequent visits.
//
// =========================================================

const enableAutomaticWinterModes = (settings = {}) => {
    return normalizeSettings({
        ...settings,

        snowfallEnabled: true,

        lightsEnabled: true,

        winterBackgroundEnabled: true,

        musicEnabled: true,
    });
};

// =========================================================
// LOAD SETTINGS
// =========================================================

const loadSettings = () => {
    if (typeof window === "undefined") {
        return {
            ...DEFAULT_SETTINGS,
        };
    }

    try {
        const savedSettings =
            window.localStorage.getItem(STORAGE_KEY);

        // First visit: all winter modes are enabled.

        if (!savedSettings) {
            return {
                ...DEFAULT_SETTINGS,
            };
        }

        const parsedSettings = JSON.parse(
            savedSettings
        );

        const migrationCompleted =
            window.localStorage.getItem(
                AUTO_ENABLE_MIGRATION_KEY
            ) === "true";

        // Existing installations:
        // enable all modes once after this update.

        if (!migrationCompleted) {
            return enableAutomaticWinterModes(
                parsedSettings
            );
        }

        // Returning visits:
        // restore the user's saved preferences.

        return normalizeSettings(parsedSettings);
    } catch {
        return {
            ...DEFAULT_SETTINGS,
        };
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
    // =====================================================
    // SETTINGS STATE
    // =====================================================

    const [
        settings,
        setSettings,
    ] = useState(loadSettings);

    // =====================================================
    // FIREWORKS TRIGGER STATE (SESSION ONLY)
    // =====================================================

    const [
        fireworksCount,
        setFireworksCount,
    ] = useState(0);

    // =====================================================
    // SAVE SETTINGS
    // =====================================================

    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }

        try {
            window.localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(settings)
            );

            // Mark automatic winter mode initialization
            // as completed after settings are saved.

            window.localStorage.setItem(
                AUTO_ENABLE_MIGRATION_KEY,
                "true"
            );
        } catch {
            // Ignore storage errors.
            // Winter settings can still work in memory.
        }
    }, [settings]);

    // =====================================================
    // CROSS-TAB STORAGE SYNC
    // =====================================================

    useEffect(() => {
        if (typeof window === "undefined") {
            return undefined;
        }

        const handleStorageChange = (event) => {
            if (event.key !== STORAGE_KEY) {
                return;
            }

            if (!event.newValue) {
                setSettings({
                    ...DEFAULT_SETTINGS,
                });

                return;
            }

            try {
                const parsed = JSON.parse(
                    event.newValue
                );

                setSettings(
                    normalizeSettings(parsed)
                );
            } catch {
                // Ignore malformed cross-tab payloads.
            }
        };

        window.addEventListener(
            "storage",
            handleStorageChange
        );

        return () => {
            window.removeEventListener(
                "storage",
                handleStorageChange
            );
        };
    }, []);

    // =====================================================
    // UPDATE SINGLE SETTING
    // =====================================================

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

    // =====================================================
    // TOGGLE BOOLEAN SETTING
    // =====================================================

    const toggleSetting = useCallback((key) => {
        if (!BOOLEAN_SETTINGS.includes(key)) {
            return;
        }

        setSettings((previousSettings) =>
            normalizeSettings({
                ...previousSettings,
                [key]: !Boolean(previousSettings[key]),
            })
        );
    }, []);

    // =====================================================
    // UPDATE MULTIPLE SETTINGS
    // =====================================================

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

    // =====================================================
    // RESET SETTINGS
    // =====================================================

    const resetSettings = useCallback(() => {
        setSettings({
            ...DEFAULT_SETTINGS,
        });
    }, []);

    // =====================================================
    // TRIGGER FIREWORKS
    // =====================================================

    const triggerFireworks = useCallback(() => {
        setFireworksCount(
            (previousCount) => previousCount + 1
        );
    }, []);

    // =====================================================
    // CONTEXT VALUE
    // =====================================================

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

    // =====================================================
    // RENDER
    // =====================================================

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
