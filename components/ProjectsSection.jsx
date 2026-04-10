"use client";
import Badge from "./Badge";
import { motion, AnimatePresence } from "framer-motion";
import { GithubLogoIcon } from "@phosphor-icons/react/dist/ssr";
import { DotsThreeOutlineVerticalIcon, ShareIcon } from "@phosphor-icons/react";
import { useState } from "react";
import RenderedContent from "./RenderedContent";

const ProjectsSection = ({ project, state, index, isAutoOpen, isAutoMode, disableAutoMode }) => {
  const [manualOpen, setManualOpen] = useState(false);

  const isOpen = isAutoMode ? isAutoOpen : manualOpen;

  const toggleOpen = () => {
    if (isAutoMode) {
      disableAutoMode();
      setManualOpen(!isAutoOpen);
    } else {
      setManualOpen(!manualOpen);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group w-full border-b border-gray-200 dark:border-[#ffffff1a] py-5 first:border-t-0"
    >
      <div
        className="flex justify-between items-center cursor-pointer select-none px-2 lg:px-4 w-full min-w-0"
        onClick={toggleOpen}
      >
        <div className="flex flex-col min-w-0 w-full">
          <div className="flex items-start justify-between w-full gap-3 min-w-0">
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-[#ffd686] break-words flex-1 min-w-0">
              {project?.title}
            </h3>
            <svg xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 flex-shrink-0 mt-1 md:mt-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-blue-500" : "opacity-0 md:opacity-100 group-hover:opacity-100"} text-gray-400 dark:text-gray-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base mt-1 truncate opacity-80 w-full pl-0.5">
            {project?.techstack && JSON.parse(project.techstack).join(" • ")}
          </p>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden px-2 lg:px-4"
          >
            <div className="pt-6 pb-2">
              {project.techstack && project.techstack.length > 0 && (
                <>
                  <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3 text-lg">Technologies & Tools</h4>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {JSON.parse(project.techstack)?.map((stack, index) => {
                      const badgeTypes = ["one", "two", "three", "four"];
                      return (
                        <div key={stack}>
                          <Badge text={stack} type={badgeTypes[index % 4]} />
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-4 text-lg">What I've done</h4>
              <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 text-justify mb-8">
                <RenderedContent html={project?.description} />
              </div>

              {project?.static_file && (
                <div className="mt-8 mx-auto rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-[#0a0a0a] max-w-3xl max-h-[500px] flex justify-center items-center shadow-inner">
                  {project?.resourceType === "video" ? (
                    <video
                      src={project?.static_file}
                      muted
                      autoPlay
                      loop
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <img
                      src={project?.static_file}
                      alt={project?.title || "Project Thumbnail"}
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
              )}

              <div className="flex items-center justify-center space-x-6 mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                {project?.githubLink && (
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1.5 text-base font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <GithubLogoIcon size={20} />
                    <span>Github</span>
                  </a>
                )}
                {project?.liveLink && (
                  <a
                    href={project.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1.5 text-base font-medium text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors"
                  >
                    <ShareIcon size={20} />
                    <span>Live</span>
                  </a>
                )}

                {project?.brief && (
                  <button
                    onClick={() => state(project)}
                    className="flex items-center space-x-1.5 text-sm font-medium hover:text-blue-500 transition-colors border border-gray-200 dark:border-gray-700 px-4 py-1.5 rounded-full dark:bg-gray-800/50"
                  >
                    <DotsThreeOutlineVerticalIcon size={18} />
                    <span>Brief</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProjectsSection;