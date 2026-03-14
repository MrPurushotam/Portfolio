// goku-oneko.js — based on oneko.js with Goku base form sprite sheet
// Sprite sheet dimensions: 1086 x 3042px
// Individual sprite size: ~32x32px

(function oneko() {
    const isReducedMotion =
        window.matchMedia(`(prefers-reduced-motion: reduce)`) === true ||
        window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;

    if (isReducedMotion) return;

    const nekoEl = document.createElement('div');

    let nekoPosX = 32;
    let nekoPosY = 32;

    let mousePosX = 0;
    let mousePosY = 0;

    let frameCount = 0;
    let idleTime = 0;
    let idleAnimation = null;
    let idleAnimationFrame = 0;

    const nekoSpeed = 10;

    // ─────────────────────────────────────────────────────────────────
    // SPRITE MAP — coordinates in pixels [x, y] from top-left of sheet
    // Each sprite is 32x32px. These map to base-form Goku rows.
    //
    // Row 0 (y=0):   Walking right / run cycle
    // Row 1 (y=32):  Walking left  / run cycle
    // Row 2 (y=64):  Walking down  / run cycle
    // Row 3 (y=96):  Walking up    / run cycle
    // Row 4 (y=128): Idle / standing
    // Row 5 (y=160): Alert / power-up pose
    // Row 6 (y=192): Scratch / attack animation
    // Row 7 (y=224): Tired / powering down
    // Row 8 (y=256): Sleeping / sitting
    //
    // Adjust x values if frames shift — each frame is 32px wide.
    // ─────────────────────────────────────────────────────────────────
    const SPRITE_W = 32;
    const SPRITE_H = 32;

    // Helper: convert grid col/row to pixel coords
    function px(col, row) {
        return [col * SPRITE_W, row * SPRITE_H];
    }

    // Each array entry is [pixelX, pixelY] — absolute coords on the sheet
    const spriteSets = {
        idle: [px(0, 4), px(1, 4)],
        alert: [px(0, 5)],
        scratchSelf: [px(0, 6), px(1, 6), px(2, 6)],
        scratchWallN: [px(3, 6), px(4, 6)],
        scratchWallS: [px(5, 6), px(6, 6)],
        scratchWallE: [px(7, 6), px(8, 6)],
        scratchWallW: [px(9, 6), px(10, 6)],
        tired: [px(0, 7)],
        sleeping: [px(0, 8), px(1, 8)],

        // Movement — 2 alternating walk frames per direction
        E: [px(0, 0), px(1, 0)],   // moving right
        W: [px(0, 1), px(1, 1)],   // moving left
        S: [px(0, 2), px(1, 2)],   // moving down
        N: [px(0, 3), px(1, 3)],   // moving up
        NE: [px(2, 0), px(3, 0)],
        NW: [px(2, 1), px(3, 1)],
        SE: [px(2, 2), px(3, 2)],
        SW: [px(2, 3), px(3, 3)],
    };

    function init() {
        nekoEl.id = 'oneko';
        nekoEl.ariaHidden = true;
        nekoEl.style.width = `${SPRITE_W}px`;
        nekoEl.style.height = `${SPRITE_H}px`;
        nekoEl.style.position = 'fixed';
        nekoEl.style.pointerEvents = 'none';
        nekoEl.style.imageRendering = 'pixelated';
        nekoEl.style.left = `${nekoPosX - SPRITE_W / 2}px`;
        nekoEl.style.top = `${nekoPosY - SPRITE_H / 2}px`;
        nekoEl.style.zIndex = 2147483647;

        // ← Point this to your Goku sprite sheet file
        let nekoFile = './goku.png';
        const curScript = document.currentScript;
        if (curScript && curScript.dataset.cat) {
            nekoFile = curScript.dataset.cat;
        }
        nekoEl.style.backgroundImage = `url(${nekoFile})`;
        // Keep background-size as the natural sheet size
        nekoEl.style.backgroundSize = `1086px 3042px`;

        document.body.appendChild(nekoEl);

        document.addEventListener('mousemove', function (event) {
            mousePosX = event.clientX;
            mousePosY = event.clientY;
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

    // setSprite now uses absolute pixel coords instead of multiplied offsets
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

        nekoEl.style.left = `${nekoPosX - SPRITE_W / 2}px`;
        nekoEl.style.top = `${nekoPosY - SPRITE_H / 2}px`;
    }

    init();
})();