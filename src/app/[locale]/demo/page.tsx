import type { Metadata } from "next";
import DemoContent from "./content";

export const metadata: Metadata = {
  title: "UI Component Demo",
  description: "Explore EduVerse UI components — glowing shadows, particle buttons, docks, and more.",
};

export default function DemoPage() {
  return <DemoContent />;
}
