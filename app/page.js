import { Body } from "@/components/Body";
import { readData } from "@/utils/common";
import { fetchGitHubContributions } from "@/lib/githubContributions";

export const metadata = {
  title: 'Home | Purushotam Jeswani',
  description: 'Explore my portfolio showcasing full-stack development expertise in React, Next.js, Node.js, and AWS. See innovative projects and skills tailored for tech roles in India and the USA.',
  openGraph: {
    title: 'Purushotam Jeswani - Full-Stack Developer Portfolio',
    description: 'Discover innovative projects and expertise in full-stack development, including React, Next.js, Docker, Prisma, and AWS. Connect with Purushotam Jeswani today!',
    images: ['/favicon-96x96.png'],
    type: 'website'
  }
};

const fetchStaticDataServerSide = async () => {
  try {
    const [data, githubHeatmapData] = await Promise.all([
      readData({
        revalidate: 24 * 3600,
        tags: ['projects', 'skills', 'profile', 'resume', 'githubHeatmapTheme']
      }),
      fetchGitHubContributions().catch(err => {
        console.error('Error fetching GitHub data:', err);
        return null;
      })
    ]);

    return {
      props: {
        projects: data.projects || [],
        skills: data.skills || [],
        profile: data.profile || {},
        resumeDocId: data.resumeDocId || '',
        githubHeatmapTheme: data.githubHeatmapTheme || 'ocean',
        githubHeatmapData,
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        projects: [],
        skills: [],
        profile: {},
        resumeDocId: '',
        githubHeatmapTheme: 'ocean',
        githubHeatmapData: null,
      },
    };
  }
};


{/* <div className="bg-yellow-500/30 border border-yellow-400 text-yellow-700 px-4 py-1 text-center" role="alert">
  <p className="font-bold">Under Construction</p>
  <p className="text-sm">This website is currently in the build phase and might break.</p>
</div> */}

export default async function Home() {
  const data = await fetchStaticDataServerSide();
  const { projects, skills, profile, resumeDocId, githubHeatmapTheme, githubHeatmapData } = data.props;
  return (
    <Body key={Date.now()} projects={projects} skills={skills} profile={profile} resumeDocId={resumeDocId} githubHeatmapTheme={githubHeatmapTheme} githubHeatmapData={githubHeatmapData} />
  );
}
