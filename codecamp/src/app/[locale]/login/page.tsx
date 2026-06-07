import type { Metadata } from "next";
import LoginContent from "./content";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to EduVerse to continue your learning journey. Access your courses, track progress, and earn achievements.",
  openGraph: { title: "Sign In — EduVerse", description: "Sign in to continue your learning journey." },
};

export default function LoginPage() {
  return <LoginContent />;
}
