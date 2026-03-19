"use client";
import ProjectsSection from "./ProjectsSection";
import SkillComponent from "./SkillComponent";
import Socials from "./Socials";
import { useEffect, useMemo, useRef, useState } from "react";
import BriefProject from "./BriefProject";
import Badge from "./Badge";
import GitHubHeatmap from "./GitHubHeatmap";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { FileArrowDownIcon, StudentIcon } from "@phosphor-icons/react";
import { CaretDownIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

export function Body({ projects, skills, profile, resumeDocId }) {
    const [isProjectBriefObject, setIsProjectBriefObject] = useState(false);
    const langCount = useRef({});
    const [uniqueLanguages, setUniqueLanguges] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [paticularLang, setPaticularLang] = useState("");
    const groupedSkills = useMemo(() => {
        const groups = {};
        skills.forEach(skill => {
            const type = skill.type ? skill.type.toLowerCase() : 'other';
            if (!groups[type]) {
                groups[type] = [];
            }
            groups[type].push(skill);
        });
        return groups;
    }, [skills]);

    const initializeLanguages = () => {
        const langMap = {};

        projects?.forEach((project) => {
            JSON.parse(project.techstack).forEach((tech) => {
                langMap[tech] = (langMap[tech] || 0) + 1;
            });
        });

        langCount.current = langMap;
        setUniqueLanguges(Object.keys(langMap));
        setFilteredProjects(projects);
    };

    const handleBadgeClick = (language) => {
        setPaticularLang(language)
        sortProjects(language);
    };
    const sortProjects = (language) => {
        if (!language) {
            setFilteredProjects(projects);
        } else {
            const filtered = projects.filter((project) =>
                JSON.parse(project.techstack).includes(language)
            );
            setFilteredProjects(filtered);
        }
    };
    useEffect(() => {
        initializeLanguages();
    }, [projects]);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        const x = (clientX / innerWidth) * 2 - 1;
        const y = (clientY / innerHeight) * 2 - 1;
        mouseX.set(x);
        mouseY.set(y);
    };

    const springConfig = { damping: 25, stiffness: 200 };
    const smoothX = useSpring(mouseX, springConfig);
    const smoothY = useSpring(mouseY, springConfig);

    const badge1X = useTransform(smoothX, [-1, 1], [-20, 20]);
    const badge1Y = useTransform(smoothY, [-1, 1], [-20, 20]);

    const badge2X = useTransform(smoothX, [-1, 1], [15, -15]);
    const badge2Y = useTransform(smoothY, [-1, 1], [15, -15]);

    const badge3X = useTransform(smoothX, [-1, 1], [-10, 10]);
    const badge3Y = useTransform(smoothY, [-1, 1], [10, -10]);

    const orbX = useTransform(smoothX, [-1, 1], [30, -30]);
    const orbY = useTransform(smoothY, [-1, 1], [30, -30]);

    // Badge parallax mapping removed based on user feedback

    // THOUGHT:- error whle the project brief is rendered its rendering at the center which shouldn't be the case figure out a way to fix it 
    return (
        <div className="w-full h-full relative primary-font bg-gray-200/50 dark:bg-[#10151b] text-base sm:text-lg">
            {Object.keys(isProjectBriefObject).length > 0 && (
                <div className="bg-black/50 dark:bg-black/50 z-50 flex justify-center items-center">
                    <BriefProject project={isProjectBriefObject} close={setIsProjectBriefObject} />
                </div>
            )}

            <section id="me" onMouseMove={handleMouseMove} className="min-h-[93vh] h-fit w-full py-3 mx-auto flex justify-center items-center bg-gradient-to-br from-red-500 to-red-600 dark:bg-gradient-to-br dark:from-[#0f2027] dark:via-[#203a43] dark:to-[#2c5364]"
            >
                <motion.div
                    style={{ x: orbX, y: orbY }}
                    className="absolute w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-white/40 dark:bg-teal-400/30 opacity-60 dark:opacity-20 blur-[130px] rounded-full z-0 top-[10%] left-[10%] pointer-events-none"
                />
                <motion.div
                    style={{ x: useTransform(smoothX, [-1, 1], [-30, 30]), y: useTransform(smoothY, [-1, 1], [-30, 30]) }}
                    className="absolute w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-yellow-300/40 dark:bg-rose-500/30 opacity-60 dark:opacity-20 blur-[130px] rounded-full z-0 bottom-[10%] right-[10%] pointer-events-none"
                />

                <div className="relative grid grid-cols-1 md:grid-cols-2 layout-container h-full md:gap-4 z-10">
                    <div className="flex justify-center items-center md:hidden pt-5 pb-3 mb-2 w-full relative overflow-hidden">
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                            className="relative z-10 p-[1.5px] bg-gradient-to-tr from-rose-400/30 to-red-400/30 dark:bg-gradient-to-tr dark:from-cyan-300/20 dark:to-blue-400/20 rounded-[2rem] overflow-hidden"
                        >
                            <motion.div
                                animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-2 right-2 bg-cyan-600/70 text-white px-2 py-1 rounded-full text-xs shadow-md border border-white/10 backdrop-blur-sm whitespace-nowrap z-20"
                            >
                                🚀 Building the web
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 6, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-14 right-6 bg-blue-600/70 text-white text-xs px-2 py-1 rounded-full shadow-md border border-white/10 backdrop-blur-sm whitespace-nowrap z-20"
                            >
                                🧠 Lifelong Learner
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute bottom-2 left-2 bg-indigo-600/70 text-white font-semibold text-xs px-2 py-1 rounded-full shadow-md border border-white/10 backdrop-blur-sm whitespace-nowrap z-20"
                            >
                                ⚙️ Automating stuff
                            </motion.div>

                            <img
                                src={profile || "pj_png.png"}
                                alt="Pj profile"
                                className="w-[70vw] max-w-xs h-auto rounded-[2rem] shadow-[0_0_40px_rgba(45,212,191,0.3)] dark:shadow-[0_0_40px_rgba(45,212,191,0.2)] object-cover ring-4 ring-white/10 relative z-10"
                            />
                        </motion.div>
                    </div>

                    <div className="flex flex-col justify-center items-center md:items-start text-center md:text-left md:ml-2 lg:ml-28 xl:ml-36 relative z-10">
                        <div className="flex flex-col justify-start md:justify-center">
                            <span className="text-lg md:text-xl italic text-gray-50 dark:text-gray-300 mb-1">Hi, I am</span>
                            <div className="relative inline-block w-fit mx-auto md:mx-0 group">
                                <svg
                                    className="absolute inset-0 w-[110%] h-[130%] -left-[5%] -top-[15%] text-white dark:text-[#E2E8F0] z-0 -rotate-2"
                                    viewBox="0 0 300 100"
                                    preserveAspectRatio="none"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    {/* Main thick stroke */}
                                    <motion.path
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                        stroke="currentColor"
                                        strokeWidth="35"
                                        strokeLinecap="round"
                                        d="M 10 50 Q 150 35 290 50"
                                    />
                                    {/* Top bristle stroke */}
                                    <motion.path
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                                        stroke="currentColor"
                                        strokeWidth="15"
                                        strokeLinecap="round"
                                        d="M 15 25 Q 140 10 280 25"
                                    />
                                    {/* Bottom bristle stroke */}
                                    <motion.path
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
                                        stroke="currentColor"
                                        strokeWidth="20"
                                        strokeLinecap="round"
                                        d="M 20 75 Q 160 60 285 75"
                                    />
                                </svg>
                                <span className="relative text-4xl font-semibold tracking-wide title-font text-[#0a100d] z-10 transition-transform duration-300 group-hover:scale-105 inline-block">
                                    Purushotam Jeswani
                                </span>
                            </div>
                            <span className="text-xl sm:text-2xl font-semibold md:text-2xl mt-4 text-[#FFF9E6] dark:text-[#E2E8F0] drop-shadow-md tracking-wide">
                                Full-stack Developer & DevOps Engineer
                            </span>
                            <span className="text-lg sm:text-xl md:text-xl text-gray-200 dark:text-gray-400 italic -mt-1 mb-1 font-medium tracking-wide">Building scalable apps, automating deployments</span>
                        </div>
                        <div className="flex flex-row flex-wrap justify-center md:justify-start items-center gap-4 mt-4">
                            <Link
                                href="/contact"
                                className="flex items-center justify-center gap-2 px-6 py-3 text-sm md:text-base font-bold tracking-wider rounded-full text-[#0a100d] dark:text-gray-900 uppercase bg-white dark:bg-gray-100 hover:scale-105 hover:bg-gray-200 dark:hover:bg-white transition-all duration-300 shadow-[0_4px_14px_0_rgba(255,255,255,0.39)] dark:shadow-[0_4px_14px_0_rgba(255,255,255,0.2)]"
                            >
                                Get in touch
                            </Link>
                            <a
                                href={"https://drive.google.com/file/d/" + resumeDocId + "/view?usp=sharing"}
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 px-6 py-3 text-sm md:text-base font-bold tracking-wider border-2 border-white rounded-full text-white dark:text-gray-300 uppercase bg-transparent hover:bg-white hover:text-red-600 dark:hover:bg-white dark:hover:text-[#0f2027] transition-all duration-300 hover:scale-105"
                            >
                                <FileArrowDownIcon className="w-5 h-5 md:w-6 md:h-6" />Resume
                            </a>
                        </div>
                        <div className="flex justify-center md:justify-start items-center mt-6">
                            <Socials />
                        </div>
                    </div>

                    {/* Right Image Section (only visible on md and above) */}
                    <div className="hidden md:flex justify-center items-center w-full relative overflow-hidden">
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                            className="relative z-10 p-[1.5px] bg-gradient-to-tr from-rose-400/30 to-red-400/30 dark:bg-gradient-to-tr dark:from-cyan-300/20 dark:to-blue-400/20 rounded-[2rem] overflow-hidden"
                        >
                            <motion.div
                                style={{ x: badge1X, y: badge1Y }}
                                animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-2 right-2 bg-cyan-600/70 text-white px-2 py-1 rounded-full text-xs shadow-md border border-white/10 backdrop-blur-sm whitespace-nowrap z-20"
                            >
                                🚀 Building the web
                            </motion.div>

                            <motion.div
                                style={{ x: badge2X, y: badge2Y }}
                                animate={{ y: [0, 6, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-14 right-6 bg-blue-600/70 text-white text-xs px-2 py-1 rounded-full shadow-md border border-white/10 backdrop-blur-sm whitespace-nowrap z-20"
                            >
                                🧠 Lifelong Learner
                            </motion.div>

                            <motion.div
                                style={{ x: badge3X, y: badge3Y }}
                                animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute bottom-2 left-2 bg-indigo-600/70 text-white font-semibold text-xs px-2 py-1 rounded-full shadow-md border border-white/10 backdrop-blur-sm whitespace-nowrap z-20"
                            >
                                ⚙️ Automating stuff
                            </motion.div>

                            <img
                                src={profile || "pj_png.png"}
                                alt="Pj profile"
                                className="w-full max-w-[400px] lg:max-w-[400px] rounded-[2rem] lg:rounded-[3rem] object-cover shadow-[0_0_50px_rgba(45,212,191,0.3)] dark:shadow-[0_0_50px_rgba(45,212,191,0.2)] ring-4 ring-white/10 relative z-10"
                            />
                        </motion.div>
                    </div>
                    <div className="absolute z-10 top-[102%] md:top-[108%] left-0 w-full md:col-span-2 flex justify-center items-center animate-bounce text-white text-2xl">
                        <CaretDownIcon />
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="w-full min-h-[85vh] h-fit mx-auto flex flex-col justify-center items-center p-8 dark:bg-[#10151b]">
                {/* About Me Details */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className="flex flex-col gap-4 p-6 md:p-8 w-full layout-container bg-gray-300/30 dark:bg-[#10151b]/50 ring-1 ring-gray-200 dark:ring-0 dark:border dark:border-[#ffffff1a] rounded-2xl shadow-lg backdrop-blur-sm"
                >
                    <h2 className="flex items-center justify-start md:justify-center text-[#f59e0b] dark:text-[#fff4b7] text-2xl md:text-3xl capitalize font-[730] tracking-wide master-font hover:text-[#fbbf24] dark:hover:text-[#ffd686] transition-colors duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 md:h-8 mr-2 pb-0.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        About Me
                    </h2>
                    <div className="w-12 h-[2px] bg-gray-400 dark:bg-gray-500 mx-auto rounded-full mb-2"></div>

                    <p className="text-base md:text-lg text-justify text-gray-800 dark:text-[#d2e3f8] tracking-wide leading-relaxed">
                        I thrive on building <b className="text-[#fcd34d] dark:text-[#fff4b7]">scalable</b>, high-impact solutions using <b className="text-[#fcd34d] dark:text-[#fff4b7]">React</b>, <b className="text-[#fcd34d] dark:text-[#fff4b7]">Next.js</b>, <b className="text-[#fcd34d] dark:text-[#fff4b7]">Node.js</b>, and <b className="text-[#fcd34d] dark:text-[#fff4b7]">AWS</b>. Creativity and experimentation drive my approach — I love pushing boundaries and crafting seamless experiences that go beyond just writing code.
                    </p>
                    <p className="text-base md:text-lg text-justify text-gray-800 dark:text-[#d2e3f8] tracking-wide leading-relaxed mt-2">
                        Beyond tech, I'm deeply curious about geopolitics, enjoy reading, and love exploring new places (preferably on two wheels!). With a strategic mindset and a passion for innovation, I embrace challenges with enthusiasm and a growth-focused mindset. Let’s build something extraordinary together.
                    </p>
                </motion.div>

                {/* Education Details */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                    viewport={{ once: true }}
                    className="flex flex-col gap-4 p-6 md:p-8 w-full layout-container bg-gray-300/30 dark:bg-[#10151b]/50 ring-1 ring-gray-200 dark:ring-0 dark:border dark:border-[#ffffff1a] rounded-2xl shadow-lg backdrop-blur-sm mt-8"
                >
                    <h2 className="flex items-center justify-start md:justify-center text-[#f59e0b] dark:text-[#fff4b7] text-2xl md:text-3xl capitalize font-[730] tracking-wide master-font hover:text-[#fbbf24] dark:hover:text-[#ffd686] transition-colors duration-300">
                        <StudentIcon className="w-6 h-6 md:w-8 md:h-8 mr-2 pb-0.5" />
                        Education
                    </h2>
                    <div className="w-12 h-[2px] bg-gray-400 dark:bg-gray-500 mx-auto rounded-full mb-4"></div>

                    <div className="flex flex-col gap-2 relative pl-2 md:pl-10">
                        {/* Vertical Timeline Line */}
                        <div className="absolute left-[17px] md:left-[49px] top-6 bottom-4 w-0.5 bg-gradient-to-b from-gray-400/40 to-gray-400/10 dark:from-[#ffd686]/40 dark:to-transparent"></div>

                        {/* Timeline Item 1 */}
                        <div className="relative flex items-start gap-5 group">
                            <div className="flex flex-col items-center pt-1.5 relative z-10 w-fit">
                                <div className="w-5 h-5 rounded-full border-4 border-red-500 dark:border-[#10151b] bg-white dark:bg-[#ffd686] flex-shrink-0 shadow-[0_0_8px_rgba(0,0,0,0.2)] dark:shadow-[0_0_8px_rgba(255,255,255,0.5)]"></div>
                            </div>
                            <div className="flex flex-col pb-8">
                                <h3 className="font-bold text-gray-800 dark:text-[#ffd686] text-lg md:text-xl">Lovely Professional University</h3>
                                <span className="text-red-600 dark:text-gray-300 text-sm md:text-base font-semibold mb-1">B.Tech in Computer Science and Engineering</span>
                                <time className="text-sm text-gray-600 dark:text-gray-500 mb-2">2022 - 2026 • Phagwara, Punjab</time>
                            </div>
                        </div>

                        {/* Timeline Item 2 */}
                        <div className="relative flex items-start gap-5 group">
                            <div className="flex flex-col items-center pt-1.5 relative z-10 w-fit">
                                <div className="w-5 h-5 rounded-full border-4 border-red-500 dark:border-[#10151b] bg-white dark:bg-[#ffd686] flex-shrink-0 shadow-[0_0_8px_rgba(0,0,0,0.2)] dark:shadow-[0_0_8px_rgba(255,255,255,0.5)]"></div>
                            </div>
                            <div className="flex flex-col">
                                <h3 className="font-bold text-gray-800 dark:text-[#ffd686] text-lg md:text-xl">Lakshmipat Singhania Public School</h3>
                                <span className="text-red-600 dark:text-gray-300 text-sm md:text-base font-semibold mb-1">High School</span>
                                <time className="text-sm text-gray-600 dark:text-gray-500 mb-2">2019 - 2021 • Rayagada, Odisha</time>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <GitHubHeatmap />
            </section>



            <section id="skills" className="w-full mx-auto flex flex-col justify-center pt-8 pb-7">

                <div className="relative flex mt-8 mb-8 justify-center items-center">
                    <motion.h2 initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }} className="relative flex items-center flex-row master-font gap-2 text-xl md:text-3xl font-bold text-center tracking-wide text-grey-900 dark:text-[#fff4b7]"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor"
                            className="w-9 h-9 md:w-12 md:h-12 text-gray-900 mb-1">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                d="M8 9l3 3-3 3m5 0h3" />
                        </svg>
                        Skills
                    </motion.h2>
                </div>
                <div className="layout-container p-5 space-y-10">
                    {Object.keys(groupedSkills).map((type) => (
                        <div key={type} className="flex justify-center flex-col gap-2">
                            <h2 className="text-xl md:text-2xl font-semibold border-l-4 border-gray-900 pl-3 mb-4 text-gray-900 dark:text-[#fcd34d] master-font capitalize">
                                {type}
                            </h2>
                            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                                {groupedSkills[type].map((skill, i) => (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.05, duration: 0.4 }}
                                        viewport={{ once: true }}
                                        key={skill.id}
                                        className="w-[45%] sm:w-[28%] md:w-[22%] lg:w-[16%] h-fit"
                                    >
                                        <SkillComponent tag={skill.name} link={skill.imagelink} type={skill.type} />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Projects Section */}
            <section id="projects" className="py-10">
                <div className="w-full space-y-6">
                    <div className="relative flex flex-col justify-center items-center layout-container ">
                        {/* <div className=" w-2/3 mx-auto absolute top-0 left-0 right-0  h={[3px]} bg-black bg-gradient-to-r from-transparent via-black to-transparent"></div> */}
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="relative flex items-center gap-1 text-xl md:text-3xl master-font font-bold text-center tracking-wide text-red-500"
                            id="projects"
                        >
                            <span className="text-white">🚀</span> Projects
                        </motion.h1>
                        <div className=" w-2/3 mx-auto my-2 h-[3px] bg-black dark:bg-white bg-gradient-to-r from-transparent via-black to-transparent dark:from-white dark:via-red-500 dark:to-white"></div>
                        <div className="w-full sm:w-full min-h-16 mx-auto p-2 flex flex-wrap justify-center items-center gap-2">
                            <Badge text={"All"} type="outline" count={projects?.length} onClick={() => handleBadgeClick("")} className={`hover:scale-[1.05] ${(paticularLang === "") ? "bg-rose-500/90 text-white" : ""}`} />
                            {
                                uniqueLanguages.map((tech, idx) => {
                                    return (
                                        <Badge key={idx} text={tech} type="outline" count={langCount.current[tech]} onClick={() => handleBadgeClick(tech)} className={`${paticularLang === tech ? "bg-rose-500/90 text-white" : ""}`} />
                                    )
                                })
                            }
                        </div>
                    </div>

                    <div className="layout-container space-y-4 p-5">
                        {filteredProjects?.map((project) => (
                            <ProjectsSection key={project.id} project={project} state={setIsProjectBriefObject} />
                        ))}
                    </div>
                </div>
            </section>
        </div >
    );
}
