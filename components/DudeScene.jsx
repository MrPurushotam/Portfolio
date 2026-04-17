import { useRef, useState } from "react";

export const DudesScene = () => {
    const containerRef = useRef(null);
    const [hoveredDude, setHoveredDude] = useState(null);
    const [flowerAnimated, setFlowerAnimated] = useState(false);

    const handleHover = (e) => {
        if (!containerRef.current) return;
        const containerRect = containerRef.current.getBoundingClientRect();
        const rect = e.target.getBoundingClientRect();

        setHoveredDude({
            left: rect.left - containerRect.left,
            width: rect.width,
            top: rect.top - containerRect.top,
            height: rect.height
        });
    };

    const handleLeave = () => setHoveredDude(null);

    const handlePizzaClick = () => {
        try {
            const audio = new Audio('/ting.mp3');
            audio.volume = 0.5;
            audio.play().catch(err => console.log('Audio playback block handled', err));
        } catch (e) {
            console.error("Audio not initialized");
        }
    };

    const handleFlowerClick = () => {
        if (flowerAnimated) return;
        setFlowerAnimated(true);
        setTimeout(() => setFlowerAnimated(false), 1000);
    };

    return (
        <div
            className="w-full relative overflow-hidden select-none z-10 pt-24 md:pt-32 pb-0 bg-gradient-to-b from-gray-200/50 via-[#111]/30 to-[#111] dark:from-[#1a1a1a] dark:via-[#151515] dark:to-[#111]"
            ref={containerRef}
            onMouseLeave={handleLeave}
        >
            {/* Disco Light Spotlight Beam */}
            {hoveredDude && (
                <div
                    className="absolute top-0 w-full h-full pointer-events-none mix-blend-screen z-50 transition-opacity duration-300 opacity-60"
                    style={{
                        background: 'linear-gradient(to bottom, rgba(255,100,255,0.7) 0%, rgba(0,255,255,0.3) 100%)',
                        animation: 'discoColors 2s linear infinite',
                        clipPath: `polygon(50% -10%, ${hoveredDude.left - 20}px ${hoveredDude.top + hoveredDude.height}px, ${hoveredDude.left + hoveredDude.width + 20}px ${hoveredDude.top + hoveredDude.height}px)`
                    }}
                />
            )}

            {/* Ambient Background Glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 max-w-4xl h-24 bg-white/5 blur-3xl rounded-[100%] z-0 pointer-events-none"></div>


            <div className="flex items-end justify-between px-2 md:px-12 w-full max-w-[1600px] mx-auto min-h-[180px] md:min-h-[280px] relative z-10">

                {/* Cluster 1: Left Flank */}
                <div className="flex items-end -ml-4 md:ml-0 opacity-95 scale-90 md:scale-100 flex-shrink-0 ">
                    <img src="/dude_assets/chic_guy.png" className="h-[120px] md:h-[180px] object-contain drop-shadow-md cursor-pointer transition-transform duration-300 hover:scale-110" onMouseEnter={handleHover} alt="Chic" />
                    <div className="hidden sm:flex flex-col items-center -ml-6 pb-2">
                        <img
                            src="/dude_assets/dude_flowers.png"
                            className={`h-[90px] md:h-[120px] -mb-4 z-10 relative object-contain drop-shadow-md cursor-pointer transition-transform duration-300 hover:scale-110 ${flowerAnimated ? 'animate-dude-flip' : ''}`}
                            onMouseEnter={handleHover}
                            onClick={handleFlowerClick}
                            alt="Flowers"
                        />
                        <img src="/dude_assets/dude_artist.webp" className="h-[110px] md:h-[160px] object-contain drop-shadow-md cursor-pointer transition-transform duration-300 hover:scale-110" onMouseEnter={handleHover} alt="Artist" />
                    </div>
                </div>

                {/* Cluster 2: Singer Rocking */}
                <div className="pb-2 hidden xl:flex flex-shrink-0 ">
                    <img src="/dude_assets/dude_singer.png" className="h-[130px] md:h-[200px] transform -rotate-[15deg] origin-bottom object-contain drop-shadow-lg cursor-pointer transition-transform duration-300 hover:scale-110" onMouseEnter={handleHover} alt="Singer" />
                </div>

                {/* Cluster 3: Tower Stack */}
                <div className="hidden md:flex flex-col items-center pb-2 z-20 flex-shrink-0">
                    <img src="/dude_assets/dude_rainbowspike.png" className="h-[80px] md:h-[120px] -mb-4 md:-mb-6 z-10 relative object-contain drop-shadow-md cursor-pointer transition-transform duration-300 hover:scale-110" onMouseEnter={handleHover} alt="Rainbow" />
                    <img src="/dude_assets/dude_starglasses.png" className="h-[100px] md:h-[150px] object-contain drop-shadow-md cursor-pointer transition-transform duration-300 hover:scale-110" onMouseEnter={handleHover} alt="Star Glasses" />
                </div>

                {/* Cluster 4: Small group breaking structure */}
                <div className="flex items-end gap-2 md:gap-4 pb-2 z-10 scale-90 md:scale-100 flex-shrink-0">
                    <img src="/dude_assets/dude_dodgeball.png" className="h-[80px] md:h-[110px] object-contain drop-shadow-md mb-2 hidden md:block cursor-pointer transition-transform duration-300 hover:scale-110" onMouseEnter={handleHover} alt="Dodgeball" />
                    <img src="/dude_assets/cowboy_sparkles.webp" className="h-[120px] md:h-[180px] object-contain drop-shadow-md cursor-pointer transition-transform duration-300 hover:scale-110" onMouseEnter={handleHover} alt="Cowboy" />
                </div>

                {/* Cluster 5: The Centerpiece Giant */}
                <div className="pb-4 z-30 mx-2 md:mx-6 flex-shrink-0">
                    <img src="/dude_assets/dude_goggles.png" className="h-[180px] md:h-[280px] object-contain drop-shadow-2xl cursor-pointer transition-transform duration-300 hover:scale-[1.03]" onMouseEnter={handleHover} alt="Goggles Giant" />
                </div>

                {/* Cluster 6: Hovering Fairies and Pizza */}
                <div className="flex items-end gap-2 xl:gap-8 pb-2 z-10 flex-shrink-0">
                    <img src="/dude_assets/dude_pizza.png" className="h-[110px] md:h-[160px] object-contain drop-shadow-md hidden md:block cursor-pointer transition-transform duration-300 hover:scale-110" onMouseEnter={handleHover} onClick={handlePizzaClick} alt="Pizza" />
                    <img src="/dude_assets/fairy_guy.png" className="h-[90px] md:h-[130px] mb-12 lg:mb-20 object-contain drop-shadow-lg cursor-pointer transition-transform duration-300 hover:scale-110" onMouseEnter={handleHover} alt="Fairy" />
                </div>

                {/* Cluster 7: Repetitions stacked */}
                <div className="hidden lg:flex flex-col items-center pb-2 z-10 flex-shrink-0">
                    <img src="/dude_assets/dude_basketabll.png" className="h-[75px] md:h-[100px] -mb-4 z-10 relative object-contain drop-shadow-md cursor-pointer transition-transform duration-300 hover:scale-110" onMouseEnter={handleHover} alt="Basketball 2" />
                    <img src="/dude_assets/dude_overalls.png" className="h-[120px] md:h-[170px] -scale-x-100 object-contain drop-shadow-md cursor-pointer transition-transform duration-300 hover:scale-110" onMouseEnter={handleHover} alt="Overalls" />
                </div>

                {/* Cluster 8: Basketball + Tube guy + Flipped Artist */}
                <div className="flex items-end pb-2 -mr-4 md:mr-0 z-20 scale-90 md:scale-100 flex-shrink-0">
                    <div className="hidden sm:flex flex-col items-center -mr-6 z-20">
                        <img src="/dude_assets/dude_basketabll.png" className="h-[70px] md:h-[110px] -mb-4 md:-mb-6 z-10 relative object-contain drop-shadow-md cursor-pointer transition-transform duration-300 hover:scale-110" onMouseEnter={handleHover} alt="Basketball" />
                        <img src="/dude_assets/tube_guy.png" className="h-[90px] md:h-[140px] flex object-contain drop-shadow-md cursor-pointer transition-transform duration-300 hover:scale-110" onMouseEnter={handleHover} alt="Tube" />
                    </div>
                    <img src="/dude_assets/dude_artist.webp" className="h-[130px] md:h-[200px] -scale-x-100 object-contain drop-shadow-xl cursor-pointer transition-transform duration-300 hover:scale-110" onMouseEnter={handleHover} alt="Artist Flipped" />
                </div>
            </div>

            <div className="w-full absolute bottom-0 h-[1px] bg-neutral-800 opacity-50 z-20 pointer-events-none"></div>
        </div>
    );
};
