import Link from 'next/link';
import React from 'react';
import LinkedIn from './svgs/LinkedIn';
import Github from './svgs/Github';
import Leetcode from './svgs/Leetcode';
import Mail from './svgs/Mail';
import X from './svgs/X';

const SocialIcons = () => {
    const arr = [
        {
            name: 'LinkedIn', href: 'https://www.linkedin.com/in/purushotamjeswani', hoverClass: 'hover:text-[#0077b5]', icon: (
                <LinkedIn />
            )
        },
        {
            name: 'GitHub', href: 'https://github.com/MrPurushotam', hoverClass: 'hover:text-black dark:hover:text-white', icon: (
                <Github />
            )
        },
        {
            name: 'X', href: 'https://x.com/purushotam___j', hoverClass: 'hover:text-black dark:hover:text-white', icon: (
                <X />
            )
        },
        {
            name: 'LeetCode', href: 'https://leetcode.com/u/MrPurushotam', hoverClass: 'hover:text-[#FFA116]', icon: (
                <Leetcode />
            )
        },
        {
            name: "Mail", href: "mailto:work.purushotam@gmail.com", hoverClass: "hover:text-[#ea4335]", icon: (
                <Mail />
            )
        }
    ]
    return (
        <ul className="flex justify-center items-center gap-4">
            {arr.map((social, index) => (
                <li key={index} className="relative group">
                    <Link
                        target='_blank'
                        rel='noopener noreferrer'
                        aria-label={social.name}
                        href={social.href}
                        className={`flex justify-center items-center w-12 h-12 rounded-full bg-white dark:bg-zinc-800/80 text-gray-500 dark:text-gray-400 border border-black/5 dark:border-white/10 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-md ${social.hoverClass}`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="22"
                            height="22"
                            fill="currentColor"
                            className="transition-colors duration-300"
                            viewBox="0 0 16 16"
                        >
                            {social.icon}
                        </svg>
                    </Link>
                    <div className="absolute top-[54px] left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-medium px-2.5 py-1 rounded-md opacity-0 invisible transition-all duration-300 translate-y-2 group-hover:translate-y-0 group-hover:opacity-100 group-hover:visible pointer-events-none whitespace-nowrap z-50">
                        {social.name}
                        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-white rotate-45 -z-10"></div>
                    </div>
                </li>
            ))
            }
        </ul >
    );
};

export default SocialIcons;
