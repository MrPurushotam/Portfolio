import Appbar from "@/components/Appbar";
import Footer from "@/components/Footer";
import ResumeIntegration from "@/components/resume"
import { readData } from "@/utils/common";

export const metadata = {
  title: 'Resume',
  description: 'View the professional resume of Purushotam Jeswani, a full-stack developer specializing in React, Next.js, Node.js, Docker, AWS, Prisma, MongoDB, and PostgreSQL. Highlighting industry experience, technical skills, and innovative projects for opportunities in India and the USA.',
  openGraph: {
    title: 'Resume of Purushotam Jeswani - Full-Stack Developer',
    description: 'Explore the professional journey, technical expertise, and notable projects of Purushotam Jeswani. Specializing in React, Node.js, Next.js, and AWS technologies.',
    images: ['/favicon-96x96.png'],
    type: 'website'
  }
};
const fetchResumeDocIdServerSide = async () => {
  try {
    const data = await readData({
      revalidate: 8 * 3600,
      tags: ['resume']
    });
    return data.resumeDocId;
  } catch (error) {
    console.log("Error occurred while fetching.", error.message);
    return "";
  }
};

const page = async () => {
  const resumeData = await fetchResumeDocIdServerSide();
  return (
    <ResumeIntegration resumeDocId={resumeData} />
  );
}

export default page;
