
import { useContext } from "react";

import {
    ThemeContext,
} from "../context/ThemeContext";

// =========================================================
// FSOCIETY — USE THEME HOOK
// =========================================================

const useTheme = () => {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error(
            "useTheme faqat ThemeProvider ichida ishlatilishi mumkin."
        );
    }

    return context;
};

export default useTheme;
