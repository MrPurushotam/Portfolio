// sketch-oneko.js — Black & white sketch cat
// Sprite sheet: 256x128px | 8 cols x 4 rows | 32x32px per cell
// Classic oneko layout — no audio

(function oneko() {
    const isReducedMotion =
        window.matchMedia(`(prefers-reduced-motion: reduce)`) === true ||
        window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;

    if (isReducedMotion) return;

    // ─── Config ───────────────────────────────────────────────
    const CAT_FILE = './sketch-cat.png'; // your sprite sheet filename
    const SCALE = 1;                  // 32 * 3 = 96px display size
    const SPEED = 10;
    // ──────────────────────────────────────────────────────────

    const CELL = 32;
    const DISPLAY = CELL * SCALE;
    const BG_W = 256 * SCALE;
    const BG_H = 128 * SCALE;

    const px = (col, row) => [col * CELL * SCALE, row * CELL * SCALE];

    const spriteSets = {
        idle: [px(3, 3)],
        alert: [px(7, 3)],
        scratchSelf: [px(5, 0), px(6, 0), px(7, 0)],
        scratchWallN: [px(0, 0), px(0, 1)],
        scratchWallS: [px(7, 1), px(6, 2)],
        scratchWallE: [px(2, 2), px(2, 3)],
        scratchWallW: [px(4, 0), px(4, 1)],
        tired: [px(3, 2)],
        sleeping: [px(2, 0), px(2, 1)],
        N: [px(1, 2), px(1, 3)],
        NE: [px(0, 2), px(0, 3)],
        E: [px(3, 0), px(3, 1)],
        SE: [px(5, 1), px(5, 2)],
        S: [px(6, 3), px(7, 2)],
        SW: [px(5, 3), px(6, 1)],
        W: [px(4, 2), px(4, 3)],
        NW: [px(1, 0), px(1, 1)],
    };

    const nekoEl = document.createElement('div');
    let nekoPosX = 32, nekoPosY = 32;
    let mousePosX = 0, mousePosY = 0;
    let frameCount = 0;
    let idleTime = 0;
    let idleAnimation = null;
    let idleAnimationFrame = 0;

    function init() {
        nekoEl.id = 'oneko';
        nekoEl.ariaHidden = true;
        nekoEl.style.width = `${DISPLAY}px`;
        nekoEl.style.height = `${DISPLAY}px`;
        nekoEl.style.overflow = 'hidden';
        nekoEl.style.position = 'fixed';
        nekoEl.style.pointerEvents = 'none';
        nekoEl.style.imageRendering = 'pixelated';
        nekoEl.style.left = `${nekoPosX - DISPLAY / 2}px`;
        nekoEl.style.top = `${nekoPosY - DISPLAY / 2}px`;
        nekoEl.style.zIndex = 2147483647;

        const curScript = document.currentScript;
        const nekoFile = (curScript && curScript.dataset.cat) ? curScript.dataset.cat : CAT_FILE;

        nekoEl.style.backgroundImage = `url(${nekoFile})`;
        nekoEl.style.backgroundSize = `${BG_W}px ${BG_H}px`;
        nekoEl.style.backgroundRepeat = 'no-repeat';

        document.body.appendChild(nekoEl);

        document.addEventListener('mousemove', (e) => {
            mousePosX = e.clientX;
            mousePosY = e.clientY;
        });

        window.requestAnimationFrame(onAnimationFrame);
    }

    let lastFrameTimestamp;

    function onAnimationFrame(timestamp) {
        if (!nekoEl.isConnected) return;
        if (!lastFrameTimestamp) lastFrameTimestamp = timestamp;
        if (timestamp - lastFrameTimestamp > 100) {
            lastFrameTimestamp = timestamp;
            frame();
        }
        window.requestAnimationFrame(onAnimationFrame);
    }

    function setSprite(name, frame) {
        const sprite = spriteSets[name][frame % spriteSets[name].length];
        nekoEl.style.backgroundPosition = `-${sprite[0]}px -${sprite[1]}px`;
    }

    function resetIdleAnimation() {
        idleAnimation = null;
        idleAnimationFrame = 0;
    }

    function idle() {
        idleTime += 1;

        if (idleTime > 10 && Math.floor(Math.random() * 200) === 0 && idleAnimation == null) {
            let available = ['sleeping', 'scratchSelf'];
            if (nekoPosX < 32) available.push('scratchWallW');
            if (nekoPosY < 32) available.push('scratchWallN');
            if (nekoPosX > window.innerWidth - 32) available.push('scratchWallE');
            if (nekoPosY > window.innerHeight - 32) available.push('scratchWallS');
            idleAnimation = available[Math.floor(Math.random() * available.length)];
        }

        switch (idleAnimation) {
            case 'sleeping':
                if (idleAnimationFrame < 8) { setSprite('tired', 0); break; }
                setSprite('sleeping', Math.floor(idleAnimationFrame / 4));
                if (idleAnimationFrame > 192) resetIdleAnimation();
                break;
            case 'scratchWallN':
            case 'scratchWallS':
            case 'scratchWallE':
            case 'scratchWallW':
            case 'scratchSelf':
                setSprite(idleAnimation, idleAnimationFrame);
                if (idleAnimationFrame > 9) resetIdleAnimation();
                break;
            default:
                setSprite('idle', 0);
                return;
        }
        idleAnimationFrame += 1;
    }

    function frame() {
        frameCount += 1;
        const diffX = nekoPosX - mousePosX;
        const diffY = nekoPosY - mousePosY;
        const distance = Math.sqrt(diffX ** 2 + diffY ** 2);

        if (distance < SPEED || distance < 48) {
            idle();
            return;
        }

        idleAnimation = null;
        idleAnimationFrame = 0;

        if (idleTime > 1) {
            setSprite('alert', 0);
            idleTime = Math.min(idleTime, 7);
            idleTime -= 1;
            return;
        }

        let direction = '';
        direction += diffY / distance > 0.5 ? 'N' : '';
        direction += diffY / distance < -0.5 ? 'S' : '';
        direction += diffX / distance > 0.5 ? 'W' : '';
        direction += diffX / distance < -0.5 ? 'E' : '';
        setSprite(direction, frameCount);

        nekoPosX -= (diffX / distance) * SPEED;
        nekoPosY -= (diffY / distance) * SPEED;

        nekoPosX = Math.min(Math.max(16, nekoPosX), window.innerWidth - 16);
        nekoPosY = Math.min(Math.max(16, nekoPosY), window.innerHeight - 16);

        nekoEl.style.left = `${nekoPosX - DISPLAY / 2}px`;
        nekoEl.style.top = `${nekoPosY - DISPLAY / 2}px`;
    }

    init();
})();