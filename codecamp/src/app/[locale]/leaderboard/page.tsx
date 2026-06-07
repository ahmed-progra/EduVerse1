import type { Metadata } from "next";
import LeaderboardContent from "./content";

export const metadata: Metadata = {
  title: "Leaderboard",
  description: "See top learners on EduVerse. Compete with peers, earn XP, and climb the ranks.",
  openGraph: { title: "Leaderboard — EduVerse", description: "See top learners and climb the ranks." },
};

export default function LeaderboardPage() {
  return <LeaderboardContent />;
}
