"use client"
import { DownloadSimpleIcon } from "@phosphor-icons/react";
import { GithubLogoIcon, LinkedinLogoIcon, XLogoIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

const Footer = ({ resumeDocId }) => {
    const quickLinks = [
        { name: "About", href: "/#about" },
        { name: "Skills", href: "/#skills" },
        { name: "Projects", href: "/#projects" },
        { name: "Resume", href: "/resume" },
        { name: "Contact", href: "/contact" }
    ];

    return (
        <footer className="bg-[#111] text-gray-300 py-12 md:py-16 border-t border-neutral-800">
            <div className="primary-font layout-container flex flex-col gap-12 text-base sm:text-lg">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-12 md:gap-8 text-center md:text-left">
                    <div className="flex flex-col items-center md:items-start space-y-4 max-w-[250px]">
                        <Link href="/" className="inline-block">
                            <h3 className="text-3xl md:text-4xl font-bold italic title-font tracking-wide text-white hover:text-gray-300 transition-colors">
                                Purushotam Jeswani
                            </h3>
                        </Link>
                        <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                            Crafting clean, responsive web applications and building the future one line of code at a time.
                        </p>
                    </div>

                    <div className="flex flex-col items-center md:items-center space-y-4">
                        <h4 className="text-xl md:text-2xl font-semibold master-font text-white">Explore</h4>
                        <ul className="flex flex-col space-y-2">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-white transition-colors duration-300 relative group inline-block"
                                    >
                                        {link.name}
                                        <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex flex-col items-center md:items-start space-y-4">
                        <h4 className="text-xl md:text-2xl font-semibold master-font text-white text-center w-full md:text-left">Connect</h4>

                        <div className="flex flex-col items-center md:items-start w-full space-y-5">
                            <div className="flex gap-5 justify-center md:justify-start w-full">
                                <a
                                    href="https://github.com/MrPurushotam"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-2xl text-gray-400 hover:text-white transition-transform duration-300 hover:scale-110"
                                    aria-label="GitHub"
                                >
                                    <GithubLogoIcon weight="duotone" />
                                </a>
                                <a
                                    href="https://linkedin.com/in/purushotamjeswani"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-2xl text-gray-400 hover:text-blue-400 transition-transform duration-300 hover:scale-110"
                                    aria-label="LinkedIn"
                                >
                                    <LinkedinLogoIcon weight="duotone" />
                                </a>
                                <a
                                    href="https://twitter.com/purushotam___j"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-2xl text-gray-400 hover:text-white transition-transform duration-300 hover:scale-110"
                                    aria-label="Twitter"
                                >
                                    <XLogoIcon weight="duotone" />
                                </a>
                            </div>

                            <div className="flex justify-center md:justify-start w-full pt-2">
                                <a
                                    href={`https://drive.google.com/file/d/${resumeDocId}/view?usp=sharing`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300 relative group"
                                >
                                    <DownloadSimpleIcon className="group-hover:animate-bounce text-xl" weight="bold" />
                                    <span>
                                        Resume
                                        <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
                                    </span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-neutral-800 flex justify-center items-center w-full text-sm sm:text-base text-gray-500">
                    <p className="text-center">&copy; {new Date().getFullYear()} Purushotam Jeswani. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
