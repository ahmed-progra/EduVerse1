"use client";

import { useRef, useEffect, useState, memo } from "react";

interface HtmlPreviewProps {
  code: string;
  language: string;
}

export const HtmlPreview = memo(function HtmlPreview({ code, language }: HtmlPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (language !== "html") return;
    const iframe = iframeRef.current;
    if (!iframe) return;

    try {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc) return;

      doc.open();
      doc.write(code);
      doc.close();
      setError(null);
    } catch {
      setError("Failed to render preview");
    }
  }, [code, language]);

  if (language !== "html") return null;

  return (
    <div className="rounded-[var(--radius)] border border-border overflow-hidden">
      <div className="flex items-center justify-between bg-muted px-4 py-1.5 border-b border-border">
        <span className="text-xs font-medium text-muted-foreground">Live Preview</span>
        <span className="text-[10px] text-green-500">● Live</span>
      </div>

      {error ? (
        <div className="p-4 text-sm text-destructive bg-card">{error}</div>
      ) : (
        <iframe
          ref={iframeRef}
          title="HTML Preview"
          sandbox="allow-scripts"
          className="w-full bg-white"
          style={{ height: "400px", border: "none" }}
        />
      )}
    </div>
  );
});
