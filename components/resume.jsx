"use client";
import { useEffect, useState } from "react";
import ResumeSkeleton from "./ResumeSkelenton";

const ResumeIntegration = ({ resumeDocId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [id, setId] = useState(resumeDocId || "");
  const [theme, setTheme] = useState('light');
  const resumeLink = `https://drive.google.com/file/d/${id}/preview`;

  useEffect(() => {
    const fetch = async () => {
      try {
        if (!resumeDocId) {
          const resp = await fetch("/api/all/resume", { method: 'GET' });
          if (resp.ok) {
            const data = await resp.json();
            if (data.success) {
              setId(data.resumeDocId);
            }
          }
        }
      } catch (error) {
        console.log("Error occured while fetching docId: ", error.message)
      }
    }
    fetch();
  }, [resumeDocId]);

  useEffect(() => {
    const currentTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? 'dark' : 'light';
    setTheme(currentTheme);
  }, []);

  return (
    <div className="w-full p-3 h-dvh flex items-center justify-center bg-gray-100 dark:bg-[#10151b]">
      {isLoading && (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-[#10151b] ">
          <div className="text-lg font-semibold text-[#c6c6d0] dark:text-gray-200 animate-pulse mb-4">
            Loading Resume...
          </div>
          <ResumeSkeleton className="w-full md:w-3/4 lg:w-1/2 mx-auto shadow-md rounded-md overflow-hidden bg-transparent" theme={theme} />
        </div>
      )}
      <iframe
        src={resumeLink}
        onLoad={() => setIsLoading(false)}
        className={`transition-all duration-300 ease-in-out ${isLoading ? "hidden" : "block"} w-full md:w-4/5 lg:2/3 h-dvh rounded-sm shadow-md`}
        allowFullScreen
        title="Resume Preview"
      ></iframe>
    </div>
  );
};

export default ResumeIntegration;
