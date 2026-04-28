"use client";

import React from "react";
import { useTheme } from "./ThemeProvider";
import { Sun, Moon } from "lucide-react";

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="theme-toggle-btn glass-button"
            aria-label="Toggle Theme"
        >
            {theme === "light" ? (
                <Moon size={20} className="theme-icon moon-icon" />
            ) : (
                <Sun size={20} className="theme-icon sun-icon" />
            )}
        </button>
    );
};

export default ThemeToggle;
