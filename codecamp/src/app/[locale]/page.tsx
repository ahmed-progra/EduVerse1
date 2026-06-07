import type { Metadata } from "next";
import HomeContent from "./home-content";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return {
    title: "Premium Coding Education",
    description: "Structured courses with interactive coding exercises, placement exams, and gamified learning. Master Python, JavaScript, HTML/CSS, and C++.",
    openGraph: {
      title: "EduVerse — Premium Coding Education",
      description: "Structured courses, placement exams, and gamified coding education.",
      type: "website",
    },
    alternates: { canonical: `/${params.locale}` },
  };
}

export default function HomePage() {
  return <HomeContent />;
}
