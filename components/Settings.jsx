"use client"
import React, { useState, useEffect } from 'react'
import { createPortal } from "react-dom";
import { XIcon, MoonIcon, SunIcon, MonitorIcon, SpeakerHighIcon, SpeakerSlashIcon } from "@phosphor-icons/react";
import { ONEKO_CHARACTERS, DEFAULT_CHARACTER_ID } from "@/lib/onekoCharacters";

const Settings = ({ isOpen = false, onClose = () => { } }) => {
    const [preferences, setPreferences] = useState({
        theme: "system",
        isAnnoyedByPet: false,
        selectedCharacter: DEFAULT_CHARACTER_ID,
        petSoundEnabled: true,
    });

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const savedPreferences = localStorage.getItem("user-preference");
        if (savedPreferences) {
            try {
                const parsed = JSON.parse(savedPreferences);
                setPreferences(prev => ({
                    ...prev,
                    ...parsed,
                    selectedCharacter: parsed.selectedCharacter || DEFAULT_CHARACTER_ID,
                    petSoundEnabled: parsed.petSoundEnabled !== undefined ? parsed.petSoundEnabled : true,
                }));
            } catch (error) {
                console.error("Error parsing user-preference:", error);
                setPreferences({
                    theme: "system",
                    isAnnoyedByPet: false,
                    selectedCharacter: DEFAULT_CHARACTER_ID,
                    petSoundEnabled: true,
                });
            }
        }
        setMounted(true);
    }, []);

    useEffect(() => {
        applyTheme(preferences.theme);

        if (preferences.theme !== 'system') {
            return
        };

        const media = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => applyTheme('system');
        media.addEventListener('change', handleChange);

        return () => {
            media.removeEventListener('change', handleChange);
        }
    }, [preferences.theme]);

    const applyTheme = (selectedTheme) => {
        const root = window.document.documentElement;
        const isDark = selectedTheme === "dark" || (selectedTheme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

        if (isDark) {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
    };

    const savePreferences = (newPreferences) => {
        setPreferences(newPreferences);
        localStorage.setItem("user-preference", JSON.stringify(newPreferences));
        window.dispatchEvent(new Event("user-preference-updated"));
    };

    const handleThemeChange = (selectedTheme) => {
        savePreferences({ ...preferences, theme: selectedTheme });
    };

    const handlePetPreference = () => {
        savePreferences({ ...preferences, isAnnoyedByPet: !preferences.isAnnoyedByPet });
    };

    const handleCharacterChange = (characterId) => {
        savePreferences({ ...preferences, selectedCharacter: characterId });
    };

    const handleSoundToggle = () => {
        savePreferences({ ...preferences, petSoundEnabled: !preferences.petSoundEnabled });
    };

    const selectedCharData = ONEKO_CHARACTERS.find(c => c.id === preferences.selectedCharacter);
    const anyCharHasSound = ONEKO_CHARACTERS.some(c => c.audioFile);

    if (!mounted || !isOpen) return null;

    return createPortal(
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/20 backdrop-blur-md z-40 transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4 transition-all duration-300">
                <div className="bg-white/70 dark:bg-slate-950/70 backdrop-blur-2xl rounded-2xl p-8 shadow-2xl border border-white/40 dark:border-white/5 max-h-[80vh] w-full max-w-2xl overflow-y-auto">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h2 className="text-xl font-light text-black dark:text-white tracking-wide">
                                Preferences
                            </h2>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Customize your experience</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-200"
                            aria-label="Close settings"
                        >
                            <XIcon size={20} weight="bold" />
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* Theme Setting */}
                        <div className="space-y-3">
                            <label className="text-sm font-light text-gray-700 dark:text-gray-300 tracking-wide">
                                Appearance
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { value: "light", icon: SunIcon, label: "Light" },
                                    { value: "dark", icon: MoonIcon, label: "Dark" },
                                    { value: "system", icon: MonitorIcon, label: "System" }
                                ].map(({ value, icon: Icon, label }) => (
                                    <button
                                        key={value}
                                        onClick={() => handleThemeChange(value)}
                                        className={`flex flex-col items-center justify-center py-4 px-3 rounded-lg transition-all duration-200 ${preferences.theme === value
                                            ? "bg-black/10 dark:bg-white/10 border border-black/20 dark:border-white/20"
                                            : "bg-transparent border border-transparent hover:bg-black/5 dark:hover:bg-white/5"
                                            }`}
                                    >
                                        <Icon size={22} className="text-gray-700 dark:text-gray-300 mb-2" weight="duotone" />
                                        <span className="text-sm text-gray-600 dark:text-gray-400 font-light">{label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Pet Preference */}
                        <div className="space-y-3">
                            <label className="text-sm font-light text-gray-700 dark:text-gray-300 tracking-wide">
                                Communication
                            </label>
                            <button
                                onClick={handlePetPreference}
                                className="w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 hover:bg-black/5 dark:hover:bg-white/5"
                            >
                                <span className="text-sm text-gray-700 dark:text-gray-300">Annoyed by pet?</span>
                                <div className={`w-10 h-6 rounded-full transition-all duration-300 ${preferences.isAnnoyedByPet
                                    ? "bg-gray-900 dark:bg-gray-100"
                                    : "bg-gray-300 dark:bg-gray-600"
                                    }`}>
                                    <div className={`w-5 h-5 rounded-full bg-white dark:bg-black m-0.5 transition-transform duration-300 ${preferences.isAnnoyedByPet ? "translate-x-4" : "translate-x-0"
                                        }`} />
                                </div>
                            </button>
                        </div>
                        {!preferences.isAnnoyedByPet && (
                            <>
                                {/* Character Selector */}
                                <div className="space-y-3">
                                    <label className="text-sm font-light text-gray-700 dark:text-gray-300 tracking-wide">
                                        Pet Character
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {ONEKO_CHARACTERS.map((char) => (
                                            <button
                                                key={char.id}
                                                onClick={() => handleCharacterChange(char.id)}
                                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${preferences.selectedCharacter === char.id
                                                    ? "bg-black/10 dark:bg-white/10 border border-black/20 dark:border-white/20"
                                                    : "bg-transparent border border-transparent hover:bg-black/5 dark:hover:bg-white/5"
                                                    }`}
                                            >
                                                <div className="w-10 h-10 rounded-md flex-shrink-0 flex items-center justify-center overflow-hidden bg-black/5 dark:bg-white/5">
                                                    <div
                                                        style={{
                                                            width: '32px',
                                                            height: '32px',
                                                            backgroundImage: `url(${char.spriteSheet})`,
                                                            backgroundPosition: char.spriteCoordinate ? `-${char.spriteCoordinate[0] * 32}px -${char.spriteCoordinate[1] * 32}px` : '0px 0px',
                                                            backgroundSize: char.spriteCoordinate ? '256px 128px' : 'contain',
                                                            backgroundRepeat: 'no-repeat',
                                                            imageRendering: 'pixelated',
                                                            transform: 'scale(1.25)',
                                                        }}
                                                    />
                                                </div>
                                                <div className="text-left">
                                                    <span className="text-sm text-gray-700 dark:text-gray-300 block">{char.name}</span>
                                                    {char.audioFile && (
                                                        <span className="text-[10px] text-gray-400 dark:text-gray-500">Has sound effects</span>
                                                    )}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {anyCharHasSound && (
                                    <div className="space-y-3">
                                        <button
                                            disabled={!selectedCharData?.audioFile}
                                            onClick={handleSoundToggle}
                                            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${!selectedCharData?.audioFile ? "opacity-40 cursor-not-allowed" : "hover:bg-black/5 dark:hover:bg-white/5"}`}
                                        >
                                            <div className="flex items-center gap-2">
                                                {preferences.petSoundEnabled
                                                    ? <SpeakerHighIcon size={18} className="text-gray-500 dark:text-gray-400" weight="duotone" />
                                                    : <SpeakerSlashIcon size={18} className="text-gray-500 dark:text-gray-400" weight="duotone" />
                                                }
                                                <span className="text-sm text-gray-700 dark:text-gray-300">Pet sound effects</span>
                                            </div>
                                            <div className={`w-10 h-6 rounded-full transition-all duration-300 ${preferences.petSoundEnabled
                                                ? "bg-gray-900 dark:bg-gray-100"
                                                : "bg-gray-300 dark:bg-gray-600"
                                                }`}>
                                                <div className={`w-5 h-5 rounded-full bg-white dark:bg-black m-0.5 transition-transform duration-300 ${preferences.petSoundEnabled ? "translate-x-4" : "translate-x-0"
                                                    }`} />
                                            </div>
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    <div className="my-6 border-t border-gray-200 dark:border-gray-800" />
                    <p className="text-xs text-gray-400 dark:text-gray-500 text-center font-light">
                        Settings are saved locally
                    </p>
                </div>
            </div>
        </>,
        document.body
    );
}

export default Settings;