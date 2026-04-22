'use client';

import { useEffect } from 'react';
import Clarity from '@microsoft/clarity';

export default function ClarityScript() {
    useEffect(() => {
        Clarity.init(import.meta.env.CLARITY_PROJECT_ID || '');
    }, []);

    return null;
}
