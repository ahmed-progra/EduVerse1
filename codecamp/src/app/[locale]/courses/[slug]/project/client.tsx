"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  projectId: string;
  projectTitle: string;
  projectDescription: string;
  projectRequirements: string[];
  existingSubmission: string | null;
  existingFeedback: string | null;
  existingScore: number | null;
};

export function ProjectClient({
  projectId,
  projectTitle,
  projectDescription,
  projectRequirements,
  existingSubmission,
  existingFeedback,
  existingScore,
}: Props) {
  const router = useRouter();
  const [code, setCode] = useState(existingSubmission ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(!!existingSubmission);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim() || submitting) return;
    setSubmitting(true);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, code: code.trim() }),
      });

      if (!res.ok) throw new Error("Failed to submit project");

      setSubmitted(true);
      router.refresh();
    } catch {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[var(--radius)] border border-border bg-card p-6">
        <h2 className="text-xl font-display text-card-foreground mb-2">{projectTitle}</h2>
        <p className="text-sm text-muted-foreground mb-4">{projectDescription}</p>

        <h3 className="font-medium text-card-foreground mb-2">Requirements</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground mb-6">
          {projectRequirements.map((req, i) => (
            <li key={i}>{req}</li>
          ))}
        </ul>

        {submitted && existingFeedback && (
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-4 mb-6">
            <h4 className="font-medium text-card-foreground mb-1">Feedback</h4>
            {existingScore !== null && (
              <p className="text-sm text-muted-foreground mb-2">Score: {existingScore}/100</p>
            )}
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{existingFeedback}</p>
          </div>
        )}

        {!submitted && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-card-foreground mb-1">
                Your Code
              </label>
              <textarea
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Paste your project code here..."
                rows={12}
                className="w-full rounded-[var(--radius)] border border-border bg-background px-3 py-2 text-sm text-foreground font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-y"
              />
            </div>

            <button
              type="submit"
              disabled={!code.trim() || submitting}
              className="rounded-[var(--radius)] bg-primary text-primary-foreground px-6 py-2 text-sm font-semibold hover:bg-primary/90 active:scale-[0.97] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting..." : "Submit Project"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
