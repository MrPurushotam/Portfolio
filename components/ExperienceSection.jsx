import { motion } from "motion/react";
import { BuildingsIcon } from "@phosphor-icons/react/dist/ssr";
import { BriefcaseIcon } from "@phosphor-icons/react";

const ExperienceSection = ({ experience }) => {
    if (!experience || experience.length === 0) return null;

    const parseDateStr = (dStr) => {
        if (!dStr) return 0;
        if (dStr.toLowerCase() === "present") return Infinity;
        const parsed = Date.parse(dStr);
        if (!isNaN(parsed)) return parsed;

        const monthMap = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };
        const parts = dStr.trim().split(/\s+/);
        if (parts.length >= 2) {
            const mName = parts[0].toLowerCase().substring(0, 3);
            const y = parseInt(parts[1], 10);
            const m = monthMap[mName];
            if (m !== undefined && !isNaN(y)) {
                return new Date(y, m, 1).getTime();
            }
        } else if (parts.length === 1) {
            const y = parseInt(parts[0], 10);
            if (!isNaN(y)) return new Date(y, 0, 1).getTime();
        }
        return 0;
    };

    const getRoleEndAndStartTime = (durationStr) => {
        if (!durationStr) return { start: 0, end: 0 };
        const parts = durationStr.split("-").map(p => p.trim());
        const start = parseDateStr(parts[0]);
        const end = parts.length > 1 ? parseDateStr(parts[1]) : start;
        return { start, end };
    };

    // Group experiences by company
    const groupedExperiences = [];
    for (const exp of experience) {
        if (groupedExperiences.length > 0) {
            const lastGroup = groupedExperiences[groupedExperiences.length - 1];
            if (lastGroup.company.toLowerCase() === exp.company.toLowerCase()) {
                lastGroup.roles.push(exp);
                continue;
            }
        }
        groupedExperiences.push({
            company: exp.company,
            weburl: exp.weburl,
            static_file: exp.static_file, // Keeps the logo of the first valid record of this company group
            resourceType: exp.resourceType,
            roles: [exp]
        });
    }

    // Sort interior roles newest to oldest
    groupedExperiences.forEach(group => {
        group.roles.sort((a, b) => {
            const timeA = getRoleEndAndStartTime(a.duration);
            const timeB = getRoleEndAndStartTime(b.duration);
            if (timeA.end !== timeB.end) {
                return timeB.end - timeA.end;
            }
            return timeB.start - timeA.start;
        });
    });

    const getOverallDuration = (roles) => {
        if (!roles || roles.length === 0) return "";
        if (roles.length === 1) return roles[0].duration;

        try {
            let minTime = Infinity;
            let maxTime = -Infinity;
            let startStr = "";
            let endStr = "";

            roles.forEach(r => {
                if (!r.duration) return;
                const parts = r.duration.split("-").map(p => p.trim());
                if (parts.length > 0) {
                    const startT = parseDateStr(parts[0]);
                    if (startT !== 0 && startT < minTime) {
                        minTime = startT;
                        startStr = parts[0];
                    }
                    if (parts.length > 1) {
                        const endT = parseDateStr(parts[1]);
                        if (endT !== 0 && endT > maxTime) {
                            maxTime = endT;
                            endStr = parts[1];
                        }
                    } else {
                        // If it's something like "2023" with no range, it counts as both min and max
                        if (startT !== 0 && startT > maxTime) {
                            maxTime = startT;
                            endStr = parts[0];
                        }
                    }
                }
            });

            if (!startStr) return "";
            if (endStr.toLowerCase() === "present") endStr = "Present";
            return startStr === endStr ? startStr : `${startStr} - ${endStr}`;
        } catch (e) {
            return "";
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
            viewport={{ once: true }}
            className="flex flex-col gap-4 p-6 md:p-8 w-full layout-container bg-gray-300/30 dark:bg-[#10151b]/50 ring-1 ring-gray-200 dark:ring-0 dark:border dark:border-[#ffffff1a] rounded-2xl shadow-lg backdrop-blur-sm mt-8"
        >
            <h2 className="flex items-center justify-start md:justify-center text-[#f59e0b] dark:text-[#fff4b7] text-2xl md:text-3xl capitalize font-[730] tracking-wide master-font hover:text-[#fbbf24] dark:hover:text-[#ffd686] transition-colors duration-300">

                <BriefcaseIcon className="w-6 h-6 md:w-8 md:h-8 mr-2 pb-0.5" />
                Experience
            </h2>
            <div className="w-12 h-[2px] bg-gray-400 dark:bg-gray-500 mx-auto rounded-full mb-4"></div>

            <div className="flex flex-col gap-6 relative pl-2 md:pl-10">
                <div className="absolute left-[17px] md:left-[49px] top-6 bottom-4 w-0.5 bg-gradient-to-b from-gray-400/40 to-gray-400/10 dark:from-[#ffd686]/40 dark:to-transparent"></div>

                {groupedExperiences.map((group, index) => (
                    <div key={index} className="relative flex items-start gap-5 group">
                        {/* Timeline Bullet */}
                        <div className="flex flex-col items-center pt-[14px] md:pt-[18px] relative z-10 w-fit">
                            <div className="w-5 h-5 rounded-full border-4 border-red-500 dark:border-[#10151b] bg-white dark:bg-[#ffd686] flex-shrink-0 shadow-[0_0_8px_rgba(0,0,0,0.2)] dark:shadow-[0_0_8px_rgba(255,255,255,0.5)]"></div>
                        </div>

                        <div className="flex flex-col pb-6 w-full gap-4">
                            {/* Company Banner (Logo + Name) */}
                            <div className="flex flex-row items-center gap-4">
                                {group.static_file ? (
                                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200/50 dark:border-white/10 shadow-sm bg-white dark:bg-white/5 p-[0.35rem] relative z-10 flex items-center justify-center">
                                        {group.resourceType === "video" ? (
                                            <video src={group.static_file} controls className="max-w-full max-h-full object-contain" />
                                        ) : (
                                            <img src={group.static_file} alt={`${group.company} visual`} className="max-w-full max-h-full object-contain" />
                                        )}
                                    </div>
                                ) : (
                                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200/50 dark:border-white/10 shadow-sm bg-gray-100 dark:bg-[#151c24] p-[0.6rem] relative z-10 flex items-center justify-center text-gray-500 dark:text-gray-400">
                                        <BuildingsIcon weight="duotone" className="w-full h-full" />
                                    </div>
                                )}
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
                                    {group.weburl ? (
                                        <a href={group.weburl} target="_blank" rel="noopener noreferrer" className="text-xl md:text-2xl font-bold text-gray-800 dark:text-[#ffd686] block hover:underline hover:text-red-500 transition-colors">
                                            {group.company}
                                        </a>
                                    ) : (
                                        <h3 className="font-bold text-gray-800 dark:text-[#ffd686] text-xl md:text-2xl">{group.company}</h3>
                                    )}
                                </div>
                            </div>

                            {/* Inner Roles List */}
                            <div className="flex flex-col gap-6 w-full mt-1">
                                {group.roles.map((roleExp, rIndex) => (
                                    <div key={roleExp.id || rIndex} className="relative w-full">
                                        <div className="flex flex-col sm:flex-row w-full justify-between items-start sm:items-center">
                                            <div className="flex items-center gap-3">
                                                {/* Mini connector for grouped roles */}
                                                {group.roles.length > 1 && (
                                                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 dark:bg-red-500/80 hidden sm:block"></div>
                                                )}
                                                <span className="font-semibold text-lg text-gray-700 dark:text-gray-200">{roleExp.role}</span>
                                            </div>
                                            <time className="text-sm text-gray-500 dark:text-gray-400 mt-1 sm:mt-0 font-medium pb-1 whitespace-nowrap sm:bg-gray-200/50 sm:dark:bg-white/10 sm:px-3 sm:py-1 rounded-full w-fit">
                                                {roleExp.duration}
                                            </time>
                                        </div>

                                        {roleExp.description && (
                                            <div className={`mt-3 pl-2 sm:pl-[22px] text-base text-gray-800 dark:text-[#d2e3f8] prose prose-sm dark:prose-invert max-w-none text-justify`}>
                                                <div dangerouslySetInnerHTML={{ __html: roleExp.description }} />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default ExperienceSection;
