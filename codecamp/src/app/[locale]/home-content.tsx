"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useLocale } from "next-intl";
import { BackgroundPaths } from "@/components/ui/background-paths";
import { LandingSections } from "@/components/landing-sections";

export default function Home() {
  const router = useRouter();
  const locale = useLocale();
  const { data: session } = useSession();

  function handleCta() {
    if (session) {
      if (session.user?.onboardingComplete) {
        router.push(`/${locale}/dashboard`);
      } else {
        router.push(`/${locale}/onboarding`);
      }
    } else {
      router.push(`/${locale}/register`);
    }
  }

  const cta = session ? "Go to Dashboard" : "Get Started";

  return (
    <>
      <BackgroundPaths
        title="EduVerse"
        description={
          session
            ? undefined
            : [
                "Structured courses with interactive coding exercises",
                "Placement exams to find your perfect starting level",
                "Gamified learning — earn XP, level up, compete on the leaderboard",
              ]
        }
        cta={cta}
        onCta={handleCta}
      />
      <LandingSections cta={cta} onCta={handleCta} />
    </>
  );
}
