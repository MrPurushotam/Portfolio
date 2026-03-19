"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

const COLOR_THEMES = {
    flame: {
        label: "🔥 Flame",
        colors: {
            NONE: { light: "#f3f4f6", dark: "#1a1a2e" },
            FIRST_QUARTILE: { light: "#fed7aa", dark: "#7c2d12" },
            SECOND_QUARTILE: { light: "#fb923c", dark: "#c2410c" },
            THIRD_QUARTILE: { light: "#ea580c", dark: "#ea580c" },
            FOURTH_QUARTILE: { light: "#c2410c", dark: "#fb923c" },
        },
    },
    ocean: {
        label: "🌊 Ocean",
        colors: {
            NONE: { light: "#f3f4f6", dark: "#1a1a2e" },
            FIRST_QUARTILE: { light: "#bae6fd", dark: "#164e63" },
            SECOND_QUARTILE: { light: "#38bdf8", dark: "#0e7490" },
            THIRD_QUARTILE: { light: "#0284c7", dark: "#22d3ee" },
            FOURTH_QUARTILE: { light: "#0c4a6e", dark: "#67e8f9" },
        },
    },
    forest: {
        label: "🌿 Forest",
        colors: {
            NONE: { light: "#f3f4f6", dark: "#1a1a2e" },
            FIRST_QUARTILE: { light: "#bbf7d0", dark: "#14532d" },
            SECOND_QUARTILE: { light: "#4ade80", dark: "#15803d" },
            THIRD_QUARTILE: { light: "#16a34a", dark: "#22c55e" },
            FOURTH_QUARTILE: { light: "#15803d", dark: "#4ade80" },
        },
    },
    grape: {
        label: "🍇 Grape",
        colors: {
            NONE: { light: "#f3f4f6", dark: "#1a1a2e" },
            FIRST_QUARTILE: { light: "#e9d5ff", dark: "#3b0764" },
            SECOND_QUARTILE: { light: "#c084fc", dark: "#7e22ce" },
            THIRD_QUARTILE: { light: "#9333ea", dark: "#a855f7" },
            FOURTH_QUARTILE: { light: "#6b21a8", dark: "#c084fc" },
        },
    },
    sunset: {
        label: "☀️ Sunset",
        colors: {
            NONE: { light: "#f3f4f6", dark: "#1a1a2e" },
            FIRST_QUARTILE: { light: "#fef08a", dark: "#713f12" },
            SECOND_QUARTILE: { light: "#facc15", dark: "#a16207" },
            THIRD_QUARTILE: { light: "#f59e0b", dark: "#f59e0b" },
            FOURTH_QUARTILE: { light: "#d97706", dark: "#fbbf24" },
        },
    },
};

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

function getThemeColor(level, theme, isDark) {
    const mode = isDark ? "dark" : "light";
    return COLOR_THEMES[theme]?.colors[level]?.[mode] || "#e5e7eb";
}

function computeStats(weeks) {
    let total = 0;
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    const allDays = weeks.flatMap((w) => w.contributionDays);

    allDays.forEach((day) => {
        total += day.contributionCount;
        if (day.contributionCount > 0) {
            tempStreak++;
            longestStreak = Math.max(longestStreak, tempStreak);
        } else {
            tempStreak = 0;
        }
    });

    // Current streak: walk backwards from today
    for (let i = allDays.length - 1; i >= 0; i--) {
        if (allDays[i].contributionCount > 0) {
            currentStreak++;
        } else {
            break;
        }
    }

    return { total, currentStreak, longestStreak };
}

function getMonthPositions(weeks) {
    const positions = [];
    let lastMonth = -1;
    weeks.forEach((week, i) => {
        const firstDay = week.contributionDays[0];
        if (firstDay) {
            const month = new Date(firstDay.date).getMonth();
            if (month !== lastMonth) {
                positions.push({ month, weekIndex: i });
                lastMonth = month;
            }
        }
    });
    return positions;
}

export default function GitHubHeatmap() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [theme, setTheme] = useState("ocean");
    const [tooltip, setTooltip] = useState(null);
    const [isDark, setIsDark] = useState(false);
    const [themePickerOpen, setThemePickerOpen] = useState(false);
    const containerRef = useRef(null);
    const tooltipRef = useRef(null);
    const themePickerRef = useRef(null);

    // Detect dark mode
    useEffect(() => {
        const checkDark = () => {
            setIsDark(document.documentElement.classList.contains("dark"));
        };
        checkDark();
        const observer = new MutationObserver(checkDark);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
        return () => observer.disconnect();
    }, []);

    // Close theme picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (themePickerRef.current && !themePickerRef.current.contains(e.target)) {
                setThemePickerOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/github");
                if (!res.ok) throw new Error("Failed to fetch");
                const json = await res.json();
                setData(json);
            } catch (err) {
                console.error("Heatmap fetch error:", err);
                setError("Could not load GitHub activity");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleCellHover = useCallback((e, day) => {
        const rect = e.target.getBoundingClientRect();
        const containerRect = containerRef.current?.getBoundingClientRect();
        if (!containerRect) return;
        setTooltip({
            x: rect.left - containerRect.left + rect.width / 2,
            y: rect.top - containerRect.top - 8,
            date: day.date,
            count: day.contributionCount,
        });
    }, []);

    const handleCellLeave = useCallback(() => {
        setTooltip(null);
    }, []);

    if (loading) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col gap-4 p-6 md:p-8 w-full layout-container bg-gray-300/30 dark:bg-[#10151b]/50 ring-1 ring-gray-200 dark:ring-0 dark:border dark:border-[#ffffff1a] rounded-2xl shadow-lg backdrop-blur-sm mt-8"
            >
                <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse" />
                    <div className="h-6 w-48 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
                </div>
                <div className="h-[140px] bg-gray-200 dark:bg-gray-800/50 rounded-xl animate-pulse" />
            </motion.div>
        );
    }

    if (error) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-2 p-6 md:p-8 w-full layout-container bg-red-50/50 dark:bg-red-950/20 ring-1 ring-red-200 dark:ring-red-800/30 rounded-2xl mt-8"
            >
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </motion.div>
        );
    }

    if (!data) return null;

    const stats = computeStats(data.weeks);
    const monthPositions = getMonthPositions(data.weeks);
    const cellSize = 13;
    const cellGap = 3;
    const step = cellSize + cellGap;
    const labelOffset = 32;
    const svgWidth = labelOffset + data.weeks.length * step + 4;
    const svgHeight = 7 * step + 24; // extra for month labels

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
            viewport={{ once: true }}
            className="flex flex-col gap-4 p-6 md:p-8 w-full layout-container bg-gray-300/30 dark:bg-[#10151b]/50 ring-1 ring-gray-200 dark:ring-0 dark:border dark:border-[#ffffff1a] rounded-2xl shadow-lg backdrop-blur-sm mt-8"
        >
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <h2 className="flex items-center text-[#f59e0b] dark:text-[#fff4b7] text-2xl md:text-3xl capitalize font-[730] tracking-wide master-font hover:text-[#fbbf24] dark:hover:text-[#ffd686] transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 md:h-8 mr-2 pb-0.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                    GitHub Activity
                </h2>

                {/* Theme Selector */}
                <div className="relative" ref={themePickerRef}>
                    <button
                        onClick={() => setThemePickerOpen(!themePickerOpen)}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-full bg-gray-200/70 dark:bg-[#1e293b] text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-[#334155] transition-all duration-200 ring-1 ring-gray-300/50 dark:ring-gray-600/30"
                    >
                        <span>{COLOR_THEMES[theme].label}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`w-3.5 h-3.5 transition-transform duration-200 ${themePickerOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    <AnimatePresence>
                        {themePickerOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                                transition={{ duration: 0.15 }}
                                className="absolute right-0 top-full mt-2 z-50 bg-white dark:bg-[#1e293b] rounded-xl shadow-xl ring-1 ring-gray-200 dark:ring-gray-700/50 overflow-hidden min-w-[160px]"
                            >
                                {Object.entries(COLOR_THEMES).map(([key, val]) => (
                                    <button
                                        key={key}
                                        onClick={() => { setTheme(key); setThemePickerOpen(false); }}
                                        className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-all duration-150 ${theme === key
                                            ? "bg-gray-100 dark:bg-[#334155] text-gray-900 dark:text-white font-medium"
                                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#293548]"
                                            }`}
                                    >
                                        <span>{val.label}</span>
                                        {theme === key && (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-auto text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </button>
                                ))}
                                {/* Preview strip */}
                                <div className="px-4 py-2.5 border-t border-gray-100 dark:border-gray-700/50">
                                    <div className="flex items-center gap-1 justify-center">
                                        <span className="text-[10px] text-gray-400 mr-1">Less</span>
                                        {["NONE", "FIRST_QUARTILE", "SECOND_QUARTILE", "THIRD_QUARTILE", "FOURTH_QUARTILE"].map((level) => (
                                            <div
                                                key={level}
                                                className="w-3 h-3 rounded-sm"
                                                style={{ backgroundColor: getThemeColor(level, theme, isDark) }}
                                            />
                                        ))}
                                        <span className="text-[10px] text-gray-400 ml-1">More</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className="w-12 h-[2px] bg-gray-400 dark:bg-gray-500 mx-auto rounded-full mb-2" />

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getThemeColor("FOURTH_QUARTILE", theme, isDark) }} />
                    <span className="text-gray-600 dark:text-gray-400">
                        <span className="font-bold text-gray-900 dark:text-white text-base">{stats.total.toLocaleString()}</span> contributions this year
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-base">🔥</span>
                    <span className="text-gray-600 dark:text-gray-400">
                        <span className="font-bold text-gray-900 dark:text-white text-base">{stats.currentStreak}</span> day streak
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-base">🏆</span>
                    <span className="text-gray-600 dark:text-gray-400">
                        <span className="font-bold text-gray-900 dark:text-white text-base">{stats.longestStreak}</span> longest
                    </span>
                </div>
            </div>

            {/* Heatmap Grid */}
            <div ref={containerRef} className="relative overflow-x-auto pb-2 -mx-2 px-2">
                <svg width={svgWidth} height={svgHeight} className="block" role="img" aria-label="GitHub contribution heatmap">
                    {/* Month labels */}
                    {monthPositions.map(({ month, weekIndex }) => (
                        <text
                            key={`month-${weekIndex}`}
                            x={labelOffset + weekIndex * step + 2}
                            y={10}
                            className="fill-gray-500 dark:fill-gray-500"
                            fontSize={10}
                            fontFamily="inherit"
                        >
                            {MONTH_LABELS[month]}
                        </text>
                    ))}

                    {/* Day labels */}
                    {DAY_LABELS.map((label, i) =>
                        label ? (
                            <text
                                key={`day-${i}`}
                                x={0}
                                y={20 + i * step + cellSize - 2}
                                className="fill-gray-500 dark:fill-gray-500"
                                fontSize={10}
                                fontFamily="inherit"
                            >
                                {label}
                            </text>
                        ) : null
                    )}

                    {/* Contribution cells */}
                    {data.weeks.map((week, wi) =>
                        week.contributionDays.map((day, di) => (
                            <motion.rect
                                key={`${wi}-${di}`}
                                x={labelOffset + wi * step}
                                y={18 + di * step}
                                width={cellSize}
                                height={cellSize}
                                rx={2.5}
                                ry={2.5}
                                fill={getThemeColor(day.contributionLevel, theme, isDark)}
                                initial={{ opacity: 0, scale: 0 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{
                                    duration: 0.3,
                                    delay: Math.min(wi * 0.008 + di * 0.01, 0.8),
                                    ease: "easeOut",
                                }}
                                viewport={{ once: true }}
                                className="cursor-pointer transition-all duration-150"
                                style={{ outline: 'none' }}
                                onMouseEnter={(e) => handleCellHover(e, day)}
                                onMouseLeave={handleCellLeave}
                                onFocus={(e) => handleCellHover(e, day)}
                                onBlur={handleCellLeave}
                            />
                        ))
                    )}
                </svg>

                {/* Tooltip */}
                <AnimatePresence>
                    {tooltip && (
                        <motion.div
                            ref={tooltipRef}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 4 }}
                            transition={{ duration: 0.1 }}
                            className="absolute z-50 pointer-events-none px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 shadow-lg whitespace-nowrap"
                            style={{
                                left: tooltip.x,
                                top: tooltip.y,
                                transform: "translate(-50%, -100%)",
                            }}
                        >
                            <span className="font-bold">{tooltip.count} contribution{tooltip.count !== 1 ? "s" : ""}</span>{" "}
                            on {new Date(tooltip.date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            <div
                                className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-100"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between flex-wrap gap-2">
                <a
                    href={`https://github.com/${data?.username || ""}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                    @{data?.username || "github"} on GitHub ↗
                </a>
                <div className="flex items-center gap-1">
                    <span className="text-[10px] text-gray-500 dark:text-gray-500 mr-1">Less</span>
                    {["NONE", "FIRST_QUARTILE", "SECOND_QUARTILE", "THIRD_QUARTILE", "FOURTH_QUARTILE"].map((level) => (
                        <div
                            key={level}
                            className="w-[13px] h-[13px] rounded-sm transition-colors duration-300"
                            style={{ backgroundColor: getThemeColor(level, theme, isDark) }}
                        />
                    ))}
                    <span className="text-[10px] text-gray-500 dark:text-gray-500 ml-1">More</span>
                </div>
            </div>
        </motion.div>
    );
}
