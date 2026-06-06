import type { Metadata } from "next";
import SettingsContent from "./content";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your EduVerse account settings, learning goals, preferences, and profile.",
};

export default function SettingsPage() {
  return <SettingsContent />;
}
