"use client"
import Script from 'next/script';
import React, { useEffect, useState, useCallback } from 'react';
import { ONEKO_CHARACTERS, DEFAULT_CHARACTER_ID } from '@/lib/onekoCharacters';

export default function OnekoCat() {
    const [showCat, setShowCat] = useState(false);
    const [selectedChar, setSelectedChar] = useState(null);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [scriptKey, setScriptKey] = useState(0);

    const checkPreference = useCallback(() => {
        const savedPreferences = localStorage.getItem('user-preference');
        let isCatDisabled = false;
        let charId = DEFAULT_CHARACTER_ID;
        let sound = true;

        if (savedPreferences) {
            try {
                const parsed = JSON.parse(savedPreferences);
                isCatDisabled = parsed.isAnnoyedByPet === true;
                charId = parsed.selectedCharacter || DEFAULT_CHARACTER_ID;
                sound = parsed.petSoundEnabled !== undefined ? parsed.petSoundEnabled : true;
            } catch (error) {
                console.error("Error parsing user-preference in OnekoCat:", error);
            }
        }

        setShowCat(!isCatDisabled);
        setSoundEnabled(sound);

        const charData = ONEKO_CHARACTERS.find(c => c.id === charId) || ONEKO_CHARACTERS[0];

        setSelectedChar(prev => {
            if (prev && prev.id !== charData.id) {
                const catEl = document.getElementById('oneko');
                if (catEl) catEl.remove();
                setScriptKey(k => k + 1);
            }
            return charData;
        });

        // Clean up the DOM element if disabled
        if (isCatDisabled) {
            const catEl = document.getElementById('oneko');
            if (catEl) {
                catEl.remove();
            }
        }
    }, []);

    useEffect(() => {
        checkPreference();

        window.addEventListener("user-preference-updated", checkPreference);
        window.addEventListener("storage", checkPreference);

        return () => {
            window.removeEventListener("user-preference-updated", checkPreference);
            window.removeEventListener("storage", checkPreference);
        };
    }, [checkPreference]);

    if (!showCat || !selectedChar) {
        return null;
    }

    return (
        <Script
            key={`oneko-${selectedChar.id}-${scriptKey}`}
            src={selectedChar.scriptSrc}
            data-cat={selectedChar.spriteSheet}
            data-sound={soundEnabled ? "on" : "off"}
            strategy="lazyOnload"
        />
    );
}
