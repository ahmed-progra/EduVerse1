"use client";

import { useState, useEffect, useRef, useCallback, memo } from "react";
import type { ExecutionStep } from "@/lib/code-visualizer/types";

interface CodeVisualizerProps {
  steps: ExecutionStep[];
  code: string;
  language: string;
  onClose?: () => void;
}

export const CodeVisualizer = memo(function CodeVisualizer({
  steps,
  code,
  language,
  onClose,
}: CodeVisualizerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const step = steps[currentStep] ?? null;

  const play = useCallback(() => setIsPlaying(true), []);
  const pause = useCallback(() => setIsPlaying(false), []);
  const reset = useCallback(() => { setCurrentStep(0); setIsPlaying(false); }, []);

  const stepForward = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  }, [steps.length]);

  const stepBackward = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPlaying, speed, steps.length]);

  const codeLines = code.split("\n");

  return (
    <div className="rounded-[var(--radius)] border border-border overflow-hidden" role="region" aria-label="Code visualizer">
      <div className="flex items-center justify-between bg-muted px-4 py-2">
        <span className="text-sm font-medium">{language}</span>
        <div className="flex items-center gap-2">
          {onClose && (
            <button onClick={onClose} className="text-xs text-muted-foreground hover:text-foreground px-2" aria-label="Close visualizer">✕</button>
          )}
          <button onClick={reset} className="text-xs text-muted-foreground hover:text-foreground px-2" aria-label="Reset">Reset</button>
          <button onClick={stepBackward} disabled={currentStep === 0} className="text-sm px-1 disabled:opacity-40">◀</button>
          <button onClick={isPlaying ? pause : play} className="text-sm px-1">{isPlaying ? "⏸" : "▶"}</button>
          <button onClick={stepForward} disabled={currentStep >= steps.length - 1} className="text-sm px-1 disabled:opacity-40">▶</button>
          <span className="text-xs text-muted-foreground">{currentStep + 1}/{steps.length}</span>
          <input type="range" min={100} max={2000} step={100} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-16" aria-label="Speed" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="border-r border-border p-3 overflow-auto max-h-80 font-mono text-sm leading-relaxed bg-[#1e1e2e]">
          {codeLines.map((line, i) => (
            <div
              key={i}
              className={`px-2 py-0.5 ${
                step?.line === i + 1
                  ? "bg-primary/30 border-l-2 border-primary text-white"
                  : "text-zinc-400"
              }`}
            >
              <span className="text-zinc-600 mr-3 select-none text-xs">{i + 1}</span>
              {line || " "}
            </div>
          ))}
        </div>

        <div className="p-3 overflow-auto max-h-80 space-y-3 bg-background">
          {step && (
            <>
              {/* Call Stack */}
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Call Stack</p>
                {step.callStack.map((frame, i) => (
                  <div key={i} className="text-xs font-mono bg-muted rounded px-2 py-1 mb-0.5">
                    {frame.functionName} :{frame.line}
                  </div>
                ))}
                {step.callStack.length === 0 && (
                  <p className="text-xs text-muted-foreground italic">(global scope)</p>
                )}
              </div>

              {/* Variables */}
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Variables</p>
                {Object.entries(step.globals).map(([k, v]) => (
                  <div key={k} className="text-xs font-mono text-foreground">
                    <span className="text-muted-foreground">{k}</span> = {v}
                  </div>
                ))}
                {step.callStack[0]?.locals && Object.entries(step.callStack[0].locals).map(([k, v]) => (
                  <div key={k} className="text-xs font-mono text-foreground pl-2">
                    <span className="text-muted-foreground">{k}</span> = {v}
                  </div>
                ))}
                {Object.keys(step.globals).length === 0 && (!step.callStack[0]?.locals || Object.keys(step.callStack[0].locals).length === 0) && (
                  <p className="text-xs text-muted-foreground italic">No variables in scope</p>
                )}
              </div>

              {/* Output */}
              {step.stdout && (
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Output</p>
                  <pre className="text-xs font-mono bg-muted rounded p-2 whitespace-pre-wrap text-foreground">{step.stdout}</pre>
                </div>
              )}
            </>
          )}
          {!step && (
            <p className="text-sm text-muted-foreground text-center mt-8">No trace data available.</p>
          )}
        </div>
      </div>
    </div>
  );
});
