"use client"
import Script from 'next/script';
import React, { useEffect, useState } from 'react';

export default function OnekoCat() {
    const [showCat, setShowCat] = useState(false);

    useEffect(() => {
        const isCatDisabled = localStorage.getItem('isAnnoyedByPet') === 'true';
        setShowCat(!isCatDisabled);
    }, []);

    if (!showCat) {
        return null;
    }

    return (
        <Script
            src="/oneko/oneko.js"
            data-cat="/oneko/oneko.gif"
            strategy="lazyOnload"
        />
    );
}
