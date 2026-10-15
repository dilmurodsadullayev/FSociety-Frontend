
import React, {
    createContext,
    useCallback,
    useEffect,
    useLayoutEffect,
    useMemo,
    useState,
} from "react";

// =========================================================
// FSOCIETY THEME CONFIGURATION
// =========================================================

export const THEME_STORAGE_KEY = "fsociety-theme";

export const THEMES = Object.freeze({
    DARK: "dark",
    LIGHT: "light",
});

export const DEFAULT_THEME = THEMES.DARK;

export const ThemeContext = createContext(null);

// =========================================================
// THEME VALIDATION
// =========================================================

const isValidTheme = (value) => {
    return (
        value === THEMES.DARK ||
        value === THEMES.LIGHT
    );
};

// =========================================================
// READ SAVED THEME
// =========================================================

const getInitialTheme = () => {
    if (typeof window === "undefined") {
        return DEFAULT_THEME;
    }

    try {
        const savedTheme = window.localStorage.getItem(
            THEME_STORAGE_KEY
        );

        return isValidTheme(savedTheme)
            ? savedTheme
            : DEFAULT_THEME;
    } catch {
        return DEFAULT_THEME;
    }
};

// =========================================================
// APPLY THEME TO DOCUMENT
// =========================================================

const applyThemeToDocument = (theme) => {
    if (typeof document === "undefined") {
        return;
    }

    const root = document.documentElement;

    root.setAttribute("data-theme", theme);

    // Tailwind darkMode: "class"
    root.classList.toggle(
        "dark",
        theme === THEMES.DARK
    );

    // Native browser controls
    root.style.colorScheme = theme;
};

// =========================================================
// THEME PROVIDER
// =========================================================

export const ThemeProvider = ({ children }) => {
    const [theme, setThemeState] = useState(
        getInitialTheme
    );

    // =====================================================
    // UPDATE DOCUMENT BEFORE PAINT
    // =====================================================

    useLayoutEffect(() => {
        applyThemeToDocument(theme);
    }, [theme]);

    // =====================================================
    // PERSIST THEME
    // =====================================================

    useEffect(() => {
        try {
            window.localStorage.setItem(
                THEME_STORAGE_KEY,
                theme
            );
        } catch {
            // Storage unavailable.
            // Theme continues working in memory.
        }
    }, [theme]);

    // =====================================================
    // UPDATE THEME
    // =====================================================

    const setTheme = useCallback((nextTheme) => {
        setThemeState((currentTheme) => {
            const resolvedTheme =
                typeof nextTheme === "function"
                    ? nextTheme(currentTheme)
                    : nextTheme;

            return isValidTheme(resolvedTheme)
                ? resolvedTheme
                : currentTheme;
        });
    }, []);

    // =====================================================
    // TOGGLE THEME
    // =====================================================

    const toggleTheme = useCallback(() => {
        setThemeState((currentTheme) => {
            return currentTheme === THEMES.DARK
                ? THEMES.LIGHT
                : THEMES.DARK;
        });
    }, []);

    // =====================================================
    // SYNC BETWEEN BROWSER TABS
    // =====================================================

    useEffect(() => {
        const handleStorage = (event) => {
            if (
                event.key !== THEME_STORAGE_KEY &&
                event.key !== null
            ) {
                return;
            }

            const nextTheme = event.newValue;

            setThemeState(
                isValidTheme(nextTheme)
                    ? nextTheme
                    : DEFAULT_THEME
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

            isDark: theme === THEMES.DARK,
            isLight: theme === THEMES.LIGHT,

            setTheme,
            toggleTheme,
        }),
        [
            theme,
            setTheme,
            toggleTheme,
        ]
    );

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;
