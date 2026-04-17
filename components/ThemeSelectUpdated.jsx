"use client"
import { MoonIcon, SunIcon } from "@phosphor-icons/react/dist/ssr";
import { useEffect, useState } from "react";
import React from 'react'

const ThemeSelectAppbar = () => {
    const [theme, setTheme] = useState("dark");

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

        if (savedTheme) {
            setTheme(savedTheme);
        } else if (systemPrefersDark) {
            setTheme("dark");
        }
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = (e) => {
            if (!localStorage.getItem("theme")) {
                const newTheme = e.matches ? "dark" : "light";
                setTheme(newTheme);
                applyTheme(newTheme);
            }
        };
        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    useEffect(() => {
        applyTheme(theme);
    }, [theme]);


    const applyTheme = (selectedTheme) => {
        const root = window.document.documentElement;
        if (selectedTheme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
    };

    const handleThemeChange = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
    };
    return (
        <div className="flex items-center justify-center">
            <button
                onClick={handleThemeChange}
                className="relative flex items-center justify-center w-12 h-12 rounded-full text-2xl transition-colors duration-300 focus:outline-none hover:bg-gray-200 dark:hover:bg-gray-700"
                aria-label="Toggle theme"
            >

                <SunIcon className={`text-yellow-400 transition-all duration-300 ${theme === 'dark' ? 'rotate-0 scale-100' : 'rotate-90 scale-0'}`} />
                <MoonIcon className={`absolute text-neutral-700 transition-all duration-300 ${theme === 'light' ? 'rotate-0 scale-100' : 'rotate-90 scale-0'}`} />
            </button>
        </div>
    )
}

export default ThemeSelectAppbar
