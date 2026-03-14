"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import ThemeSelectAppbar from "./ThemeSelectUpdated";
import Settings from "./Settings";
import { GearIcon, ListIcon, XIcon } from "@phosphor-icons/react";

const Appbar = () => {
  const [isHidden, setIsHidden] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isCursorNearTop, setIsCursorNearTop] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [showPj, setShowPj] = useState(false);

  useEffect(() => {
    let lastScrollTop = 0;

    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      if (currentScrollPos > lastScrollTop && !isCursorNearTop) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
      setScrollPosition(currentScrollPos);
      lastScrollTop = currentScrollPos;
    };

    const handleMouseMove = (event) => {
      if (event.clientY < 50) {
        setIsCursorNearTop(true);
        setIsHidden(false);
      } else {
        setIsCursorNearTop(false);
      }
    };

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCursorNearTop]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPj(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);



  const backgroundColor = scrollPosition > 200 ? "bg-white/60 backdrop-blur-md border-b border-black/10 dark:bg-black/60 dark:backdrop-blur-md dark:border-b dark:border-white/10" : "bg-red-600 dark:bg-black";
  const hoverBackgroundColor = backgroundColor === "bg-gray-200 " ? "hover:bg-gray-100" : "hover:bg-red-200/50";
  const textColor = scrollPosition > 200 ? "text-black dark:text-neutral-200" : "text-white";

  return (
    <nav
      className={`primary-font w-full py-4 px-3 sticky z-50 transition-all duration-500 dark:border-b-2 dark:border-gray-900 ${backgroundColor} ${isHidden && !isCursorNearTop ? "-top-30" : "top-0"
        }`}
    >
      <div className={`layout-container flex justify-between items-center ${textColor} text-base sm:text-lg`}>
        {/* <Link href={"/"} className="flex items-center gap-2 text-2xl md:text-3xl xl:text-4xl font-medium tracking-normal">
          <Image src="/favicon.svg" alt="Logo" className="w-12 h-12  md:w-24 md:h-24" width={1} height={1} />
          Purushotam Jeswani
        </Link> */}
        <Link href={"/"} className={`flex items-center gap-2 text-2xl md:text-3xl xl:text-4xl font-bold italic tracking-wide title-font`}>
          <div className="grid place-items-center">
            <span
              className={`col-start-1 row-start-1 transition-opacity duration-500 ease-in-out ${showPj ? "opacity-0" : "opacity-100"
                }`}
            >
              Purushotam Jeswani
            </span>
            <span
              className={`col-start-1 row-start-1 transition-opacity duration-500 ease-in-out ${showPj ? "opacity-100" : "opacity-0"
                }`}
            >
              Pj
            </span>
          </div>
        </Link>

        <div className="hidden md:flex w-1/2 xl:w-2/5 text-base md:text-lg lg:text-xl 2xl:text-2xl flex-row gap-3 justify-between items-center">
          {["About", "Skills", "Projects"].map((item) => (
            <Link
              key={item}
              href={`/#${item.toLowerCase()}`}
              className="relative hover:text-opacity-80 group"
            >
              {item}
              <span className="absolute left-0 bottom-[-3px] w-0 h-[2px] bg-current transition-all duration-300 group-hover:w-10/12 group-hover:bottom-[-5px]"></span>
            </Link>
          ))}
          {["Resume", "Contact"].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase()}`}
              className="relative hover:text-opacity-80 group"
            >
              {item}
              <span className="absolute left-0 bottom-[-3px] w-0 h-[2px] bg-current transition-all duration-300 group-hover:w-full group-hover:bottom-[-5px]"></span>
            </Link>
          ))}
          <div className="flex items-center justify-center">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="relative flex items-center justify-center w-10 h-10 rounded-full text-xl transition-colors duration-300 focus:outline-none hover:bg-gray-200/60 dark:hover:bg-gray-700"
              aria-label="Open settings"
            >
              <GearIcon size={22} className={`text-black dark:text-white`} />
            </button>
          </div>

        </div>
        <div className="md:hidden flex items-center gap-3">
          <div className="flex items-center justify-center">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="relative flex items-center justify-center w-12 h-12 rounded-full text-2xl transition-colors duration-300 focus:outline-none hover:bg-gray-200/60 dark:hover:bg-gray-700"
              aria-label="Open settings"
            >
              <GearIcon size={20} className={`text-black dark:text-white transition-all duration-300 rotate-90 scale-110`} />
            </button>
          </div>

          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            aria-label="Toggle Menu"
          >
            {isDropdownOpen ? (
              <XIcon size={22} />
            ) : (
              <ListIcon size={22} />
            )}
          </button>
        </div>
      </div>
      {isDropdownOpen && (
        <div
          ref={dropdownRef}
          className={`md:hidden bg-white/15 dark:bg-grey-900/95 ${textColor} border-t border-black/10 dark:border-white/10 rounded-md`}
        >
          <div className="w-full sm:w-10/12 md:w-4/5 mx-auto flex flex-col gap-2 py-3 text-xl">
            {["About", "Skills", "Projects"].map((item) => (
              <Link
                key={item}
                href={`/#${item.toLowerCase()}`}
                className="py-2 border-b border-white/10 last:border-0 flex items-center gap-2 transition-colors duration-200 hover:text-gray-900 dark:hover:text-cyan-100"
                onClick={() => setIsDropdownOpen(false)}
              >
                <span className="text-base opacity-70 mt-1">➜</span>
                <span>{item}</span>
              </Link>
            ))}

            {["Resume", "Contact"].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="py-2 border-b border-white/10 last:border-0 flex items-center gap-2 transition-colors duration-200 hover:text-gray-900 dark:hover:text-cyan-100"
                onClick={() => setIsDropdownOpen(false)}
              >
                <span className="text-base opacity-70">➜</span>
                <span>{item}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
      <Settings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </nav>
  );
};

export default Appbar;
