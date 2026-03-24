import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { COLOR_THEMES, MONTH_LABELS, DAY_LABELS } from "@/lib/githubHeatmapConfig";
import { GithubLogoIcon } from "@phosphor-icons/react";

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

export default function GitHubHeatmap({ defaultTheme = "ocean", initialData = null }) {
    const [data, setData] = useState(initialData);
    const [loading, setLoading] = useState(!initialData);
    const [error, setError] = useState(null);
    const theme = defaultTheme;
    const [tooltip, setTooltip] = useState(null);
    const [isDark, setIsDark] = useState(false);
    const containerRef = useRef(null);
    const tooltipRef = useRef(null);

    useEffect(() => {
        const checkDark = () => {
            setIsDark(document.documentElement.classList.contains("dark"));
        };
        checkDark();
        const observer = new MutationObserver(checkDark);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
        return () => observer.disconnect();
    }, []);



    useEffect(() => {
        if (initialData) return;
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
        const container = containerRef.current;

        if (!container) return;

        const containerRect = container.getBoundingClientRect();
        setTooltip({
            x: rect.left - containerRect.left + container.scrollLeft + rect.width / 2,
            y: rect.top - containerRect.top + container.scrollTop - 8,
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
    const svgHeight = 7 * step + 24;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
            viewport={{ once: true }}
            className="flex flex-col gap-4 p-6 md:p-8 w-full layout-container bg-gray-300/30 dark:bg-[#10151b]/50 ring-1 ring-gray-200 dark:ring-0 dark:border dark:border-[#ffffff1a] rounded-2xl shadow-lg backdrop-blur-sm mt-8"
        >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <h2 className="flex items-center gap-3 text-[#f59e0b] dark:text-[#fff4b7] text-2xl md:text-3xl capitalize font-[730] tracking-wide master-font hover:text-[#fbbf24] dark:hover:text-[#ffd686] transition-colors duration-300">
                    <GithubLogoIcon size="1em" weight="fill" />
                    GitHub Activity
                </h2>
            </div>

            <div className="w-12 h-[2px] bg-gray-400 dark:bg-gray-500 mx-auto rounded-full mb-2" />

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
            <div ref={containerRef} className="relative overflow-x-auto pb-2 -mx-2 px-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <svg width={svgWidth} height={svgHeight} className="block" role="img" aria-label="GitHub contribution heatmap">
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

                <AnimatePresence>
                    {tooltip && (
                        <motion.div
                            ref={tooltipRef}
                            initial={{ opacity: 0, scale: 0.95, x: "-50%", y: "-80%" }}
                            animate={{ opacity: 1, scale: 1, x: "-50%", y: "-100%" }}
                            exit={{ opacity: 0, scale: 0.95, x: "-50%", y: "-80%" }}
                            transition={{ duration: 0.15 }}
                            className="absolute z-[100] pointer-events-none px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 shadow-lg whitespace-nowrap"
                            style={{
                                left: tooltip.x,
                                top: tooltip.y,
                                transformOrigin: "bottom center",
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
