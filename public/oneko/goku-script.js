// goku-oneko.js — Goku pixel art cursor follower
// Sprite sheet: 192x128px | 6 cols x 4 rows | 32x32px per cell
// No padding, no crop math — pure clean grid!

(function oneko() {
    const isReducedMotion =
        window.matchMedia(`(prefers-reduced-motion: reduce)`) === true ||
        window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;

    if (isReducedMotion) return;

    const nekoEl = document.createElement('div');

    let nekoPosX = 110;
    let nekoPosY = 110;
    let mousePosX = 0;
    let mousePosY = 0;
    let frameCount = 0;
    let idleTime = 0;
    let idleAnimation = null;
    let idleAnimationFrame = 0;
    const nekoSpeed = 10;

    // ─── Sheet config ─────────────────────────────────────────
    const CELL = 32;     // cell size in px (both width and height)
    const SCALE = 1;      // display at 2x → 64x64px on screen
    const DISPLAY = CELL * SCALE;   // 128px

    // Sheet rendered size
    const BG_W = 192 * SCALE;   // 768px
    const BG_H = 128 * SCALE;   // 512px

    // Simple grid position → scaled pixel offset
    const px = (col, row) => [col * CELL * SCALE, row * CELL * SCALE];
    // ──────────────────────────────────────────────────────────

    const spriteSets = {
        // Row 3: special states
        idle: [px(0, 3)],
        alert: [px(1, 3)],
        scratchSelf: [px(2, 3), px(2, 3), px(2, 3)],
        scratchWallN: [px(2, 3), px(2, 3)],
        scratchWallS: [px(2, 3), px(2, 3)],
        scratchWallE: [px(2, 3), px(2, 3)],
        scratchWallW: [px(2, 3), px(2, 3)],
        tired: [px(3, 3)],
        sleeping: [px(4, 3), px(5, 3)],

        // Row 0: walk RIGHT — 6 frames
        E: [px(0, 0), px(1, 0), px(2, 0), px(3, 0), px(4, 0), px(5, 0)],
        // Row 1: walk LEFT — 6 frames
        W: [px(0, 1), px(1, 1), px(2, 1), px(3, 1), px(4, 1), px(5, 1)],
        // Row 2: walk DOWN — 6 frames
        S: [px(0, 2), px(1, 2), px(2, 2), px(3, 2), px(4, 2), px(5, 2)],
        // No dedicated UP row — reuse walk right (back similarity)
        N: [px(0, 0), px(1, 0), px(2, 0), px(3, 0), px(4, 0), px(5, 0)],
        // Diagonals — alternate between the two cardinal directions
        NE: [px(0, 0), px(1, 0), px(2, 0)],
        NW: [px(0, 1), px(1, 1), px(2, 1)],
        SE: [px(0, 2), px(1, 2), px(2, 2)],
        SW: [px(0, 1), px(1, 2), px(0, 2)],
    };

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

        let nekoFile = './goku.png';
        const curScript = document.currentScript;
        if (curScript && curScript.dataset.cat) {
            nekoFile = curScript.dataset.cat;
        }

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

        if (distance < nekoSpeed || distance < 48) {
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

        nekoPosX -= (diffX / distance) * nekoSpeed;
        nekoPosY -= (diffY / distance) * nekoSpeed;

        nekoPosX = Math.min(Math.max(16, nekoPosX), window.innerWidth - 16);
        nekoPosY = Math.min(Math.max(16, nekoPosY), window.innerHeight - 16);

        nekoEl.style.left = `${nekoPosX - DISPLAY / 2}px`;
        nekoEl.style.top = `${nekoPosY - DISPLAY / 2}px`;
    }

    init();
})();