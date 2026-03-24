import React, { useState, useEffect } from 'react';
import { COLOR_THEMES } from '@/lib/githubHeatmapConfig';
import { ArrowCounterClockwiseIcon } from "@phosphor-icons/react";

export const GithubHeatmapSelector = ({ currentTheme, revalidate }: { currentTheme: string, revalidate?: (tag: string) => void }) => {
    const [selectedTheme, setSelectedTheme] = useState(currentTheme || 'ocean');
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (currentTheme) {
            setSelectedTheme(currentTheme);
        }
    }, [currentTheme]);

    const handleThemeUpdate = async () => {
        setUpdating(true);
        try {
            const resp = await fetch("/api/github/heatmap-theme", {
                method: "POST",
                body: JSON.stringify({ theme: selectedTheme })
            });

            if (resp.ok) {
                console.log("Github Heatmap Theme updated.");
                if (revalidate) {
                    await revalidate("githubHeatmapTheme");
                }
            }
        } catch (error) {
            console.error("Error updating theme:", error);
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="w-11/12 mx-auto h-auto">
            <label className='text-xl block text-black font-semibold mb-2'>GitHub Heatmap Theme</label>
            <div className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-4">
                    {Object.entries(COLOR_THEMES).map(([key, val]) => (
                        <div
                            key={key}
                            onClick={() => setSelectedTheme(key)}
                            className={`cursor-pointer p-3 rounded-lg border-2 transition-all block ${selectedTheme === key ? 'border-sky-500 bg-sky-50' : 'border-gray-300 hover:border-sky-300'}`}
                        >
                            <div className="font-semibold text-lg text-black mb-2">{val.label}</div>
                            <div className="flex flex-row items-center gap-1">
                                {["NONE", "FIRST_QUARTILE", "SECOND_QUARTILE", "THIRD_QUARTILE", "FOURTH_QUARTILE"].map((level) => (
                                    <div
                                        key={level}
                                        className="w-5 h-5 rounded-sm"
                                        style={{ backgroundColor: val.colors[level]?.dark }}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-row items-center my-2 gap-2">
                    {revalidate && (
                        <ArrowCounterClockwiseIcon
                            size={20}
                            className="text-2xl hover:text-sky-600 rounded-md cursor-pointer"
                            onClick={() => revalidate("githubHeatmapTheme")}
                        />
                    )}
                    <button
                        className="bg-cyan-500 text-white font-semibold text-xl px-3 py-2 rounded-md shadow-md disabled:bg-cyan-700 hover:bg-cyan-700"
                        disabled={selectedTheme === currentTheme || updating}
                        onClick={handleThemeUpdate}
                    >
                        {updating ? 'Updating...' : 'Update Theme'}
                    </button>
                </div>
            </div>
        </div>
    );
};