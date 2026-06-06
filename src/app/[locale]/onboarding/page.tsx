import type { Metadata } from "next";
import OnboardingContent from "./content";

export const metadata: Metadata = {
  title: "Onboarding",
  description: "Set up your EduVerse profile — choose your goals, preferred languages, and experience level.",
};

export default function OnboardingPage() {
  return <OnboardingContent />;
}
