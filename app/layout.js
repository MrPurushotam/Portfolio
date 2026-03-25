import { Inter, Allison, League_Spartan, Markazi_Text } from "next/font/google";
import "./globals.css";
import Provider from "@/utils/Provider";
import Appbar from "@/components/Appbar";
import Footer from "@/components/Footer";
import OnekoCat from "@/components/common/OnekoCat";
import { readData } from "@/utils/common";

const inter = Inter({ subsets: ["latin"], display: 'swap', variable: '--font-inter' });

const allison = Allison({
  subsets: ["latin"],
  weight: "400",
  display: 'swap',
  variable: '--font-allison'
});

const leagueSpartan = League_Spartan({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: 'swap',
  variable: '--font-league-spartan'

});

const markaziText = Markazi_Text({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: 'swap',
  variable: '--font-markazi'

});

const fetchStaticDataServerSide = async () => {
  try {
    const data = await readData({
      revalidate: 8 * 3600,
      tags: ['projects', 'skills', 'profile', 'resume']
    });

    return {
      props: {
        projects: data.projects || [],
        skills: data.skills || [],
        profile: data.profile || {},
        resumeDocId: data.resumeDocId || '',
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
      },
    };
  }
};


const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://purushotamjeswani.in';
export const metadata = {
  metadataBase: new URL(baseUrl),
  keywords: ['Purushotam', 'Jeswani', 'purshotam', 'purushottam', 'pourushotam', 'Purushotam jeswani portfolio', 'Purushotam jeswani', 'portfolio', 'website developer near me', 'web developer', 'Full-stack web developer', 'React developer portfolio', 'Next.js expert India USA', 'Node.js full-stack development', 'Full-stack developer for hire India', 'Full-stack developer for hire India', 'Docker and AWS web development', 'Prisma and MongoDB projects', 'PostgreSQL database expert', 'Cloudflare R2 integration', 'Full-stack development problem solver', 'Full-stack job-ready', 'Hiring React and Next.js developers', 'Skilled full-stack engineer portfolio',],
  title: {
    default: "Purushotam Jeswani Portfolio",
    template: `%s | Purushotam Jeswani`
  },
  description: "Explore the professional portfolio of Purushotam Jeswani, a full-stack developer specializing in React, Next.js, Node.js, Docker, AWS, Prisma, MongoDB, and PostgreSQL. Discover innovative projects and skills tailored for tech roles in India and the USA.",
  openGraph: {
    title: "Purushotam Jeswani Portfolio",
    description: "Explore the professional portfolio of Purushotam Jeswani, a full-stack developer specializing in React, Next.js, Node.js, Docker, AWS, Prisma, MongoDB, and PostgreSQL. Discover innovative projects and skills tailored for tech roles in India and the USA.",
    type: "website",
    url: baseUrl,
    images: [`/favicon-96x96.png`]
  }
};

export default async function RootLayout({ children }) {
  const data = await fetchStaticDataServerSide();
  const { resumeDocId } = data.props;
  return (
    <Provider>
      <html lang="en" className={`${inter.variable} ${allison.variable} ${leagueSpartan.variable} ${markaziText.variable}`}>
        <head>
          <meta name="description" content={metadata.description} />
          <meta name="keywords" content={metadata.keywords.join(", ")} />
          <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
          <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
          <link rel="shortcut icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <meta name="apple-mobile-web-app-title" content="Purushotam Portolio" />
          <link rel="manifest" href="/site.webmanifest" />

          <meta property="og:title" content={metadata.openGraph.title} />
          <meta property="og:description" content={metadata.openGraph.description} />
          <meta property="og:image:alt" content="Professional portfolio of Purushotam Jeswani showcasing full-stack development expertise" />
          <meta property="og:type" content={metadata.openGraph.type} />
          <meta property="og:url" content={metadata.openGraph.url} />
          {metadata.openGraph?.images?.map((image, index) => (
            <meta key={index} property="og:image" content={image} />
          ))}
          <link rel="canonical" href={baseUrl} />

          <meta name="google-site-verification" content=" Hyq7_rXCrzF3ib_AhDf781L1pYQmFT7oZilFhKZVWCY" />

          <link
            rel="preload"
            href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css"
            as="style"
            onLoad="this.onload=null;this.rel='stylesheet'"
          />
          <noscript>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css" />
          </noscript>

          <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com " />
          <link rel="dns-prefetch" href="https://unpkg.com" />
          <script defer src="https://cloud.umami.is/script.js" data-website-id="ec3938ba-2480-4751-ba61-cf71aee6d9e8"></script>
        </head>
        <body className={inter.className}>
          <div className="flex flex-col">
            <Appbar />
            <div className="flex-1">
              <OnekoCat />
              {children}
            </div>
            <Footer resumeDocId={resumeDocId} />
          </div>
        </body>
      </html>
    </Provider>
  );
}
