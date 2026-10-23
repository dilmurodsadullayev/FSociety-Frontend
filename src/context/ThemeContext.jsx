
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";

// =========================================================
// FSOCIETY — THEME CONTEXT
// =========================================================
//
// Single source of truth for:
//
// - Dark mode
// - Light mode
// - Theme persistence
// - Navbar theme toggle
// - Cross-tab synchronization
// - Tailwind dark mode
// - Browser color scheme
//
// =========================================================

// =========================================================
// CONFIGURATION
// =========================================================

export const THEME_STORAGE_KEY =
  "fsociety-theme";

const LEGACY_THEME_STORAGE_KEY =
  "theme";

export const THEMES = Object.freeze({
  DARK: "dark",
  LIGHT: "light",
});

export const DEFAULT_THEME =
  THEMES.DARK;

// =========================================================
// CONTEXT
// =========================================================

export const ThemeContext =
  createContext(null);

// =========================================================
// VALIDATION
// =========================================================

const isValidTheme = (value) =>
  value === THEMES.DARK ||
  value === THEMES.LIGHT;

// =========================================================
// READ SAVED THEME
// =========================================================

const getInitialTheme = () => {
  if (typeof window === "undefined") {
    return DEFAULT_THEME;
  }

  try {
    const savedTheme =
      window.localStorage.getItem(
        THEME_STORAGE_KEY
      );

    if (isValidTheme(savedTheme)) {
      return savedTheme;
    }

    // Compatibility with the old App.js
    const legacyTheme =
      window.localStorage.getItem(
        LEGACY_THEME_STORAGE_KEY
      );

    if (isValidTheme(legacyTheme)) {
      return legacyTheme;
    }
  } catch {
    // Storage may be unavailable.
  }

  // Support a theme already applied
  // before React mounted.
  const documentTheme =
    document.documentElement.getAttribute(
      "data-theme"
    );

  if (isValidTheme(documentTheme)) {
    return documentTheme;
  }

  return DEFAULT_THEME;
};

// =========================================================
// APPLY THEME
// =========================================================

const applyThemeToDocument = (theme) => {
  if (typeof document === "undefined") {
    return;
  }

  const root =
    document.documentElement;

  const isDark =
    theme === THEMES.DARK;

  // Semantic theme attribute
  root.setAttribute(
    "data-theme",
    theme
  );

  // Tailwind darkMode: "class"
  root.classList.toggle(
    "dark",
    isDark
  );

  // Native browser controls
  root.style.colorScheme =
    isDark ? "dark" : "light";
};

// =========================================================
// THEME PROVIDER
// =========================================================

export const ThemeProvider = ({
  children,
}) => {
  const [
    theme,
    setThemeState,
  ] = useState(getInitialTheme);

  // =====================================================
  // APPLY BEFORE BROWSER PAINT
  // =====================================================

  useLayoutEffect(() => {
    applyThemeToDocument(theme);
  }, [theme]);

  // =====================================================
  // PERSIST THEME
  // =====================================================

  useEffect(() => {
    try {
      // Canonical storage key
      window.localStorage.setItem(
        THEME_STORAGE_KEY,
        theme
      );

      // Legacy compatibility
      window.localStorage.setItem(
        LEGACY_THEME_STORAGE_KEY,
        theme
      );
    } catch {
      // Theme remains functional in memory.
    }
  }, [theme]);

  // =====================================================
  // SET THEME
  // =====================================================

  const setTheme = useCallback(
    (nextTheme) => {
      setThemeState((currentTheme) => {
        const resolvedTheme =
          typeof nextTheme === "function"
            ? nextTheme(currentTheme)
            : nextTheme;

        return isValidTheme(resolvedTheme)
          ? resolvedTheme
          : currentTheme;
      });
    },
    []
  );

  // =====================================================
  // TOGGLE THEME
  // =====================================================

  const toggleTheme = useCallback(() => {
    setThemeState((currentTheme) =>
      currentTheme === THEMES.DARK
        ? THEMES.LIGHT
        : THEMES.DARK
    );
  }, []);

  // =====================================================
  // SYNCHRONIZE ACROSS TABS
  // =====================================================

  useEffect(() => {
    const handleStorage = (event) => {
      if (
        event.storageArea !==
        window.localStorage
      ) {
        return;
      }

      if (
        event.key !== THEME_STORAGE_KEY &&
        event.key !==
          LEGACY_THEME_STORAGE_KEY &&
        event.key !== null
      ) {
        return;
      }

      // A changed key takes priority.
      // This also supports legacy code
      // that still writes "theme".
      if (
        isValidTheme(event.newValue)
      ) {
        setThemeState(
          event.newValue
        );

        return;
      }

      // Storage item removed or cleared.
      setThemeState(
        getInitialTheme()
      );
    };

    window.addEventListener(
      "storage",
      handleStorage
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorage
      );
    };
  }, []);

  // =====================================================
  // CONTEXT VALUE
  // =====================================================

  const value = useMemo(
    () => ({
      theme,

      isDark:
        theme === THEMES.DARK,

      isLight:
        theme === THEMES.LIGHT,

      // Compatibility with Navbar/App
      isDarkMode:
        theme === THEMES.DARK,

      setTheme,
      toggleTheme,
    }),
    [
      theme,
      setTheme,
      toggleTheme,
    ]
  );

  // =====================================================
  // PROVIDER
  // =====================================================

  return (
    <ThemeContext.Provider
      value={value}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// =========================================================
// USE THEME HOOK
// =========================================================

export const useTheme = () => {
  const context = useContext(
    ThemeContext
  );

  if (!context) {
    throw new Error(
      "useTheme() ThemeProvider ichida " +
      "ishlatilishi kerak."
    );
  }

  return context;
};

// =========================================================
// DEFAULT EXPORT
// =========================================================

export default ThemeProvider;
