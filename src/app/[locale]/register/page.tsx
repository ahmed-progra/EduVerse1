import type { Metadata } from "next";
import RegisterContent from "./content";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create your EduVerse account and start learning to code with structured courses, placement exams, and gamified challenges.",
  openGraph: { title: "Create Account — EduVerse", description: "Start learning to code with structured courses." },
};

export default function RegisterPage() {
  return <RegisterContent />;
}
