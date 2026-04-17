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

export { MONTH_LABELS, DAY_LABELS, COLOR_THEMES };