"use client";

import { motion, AnimatePresence } from "motion/react";

export type OutputState = "idle" | "running" | "success" | "error";

interface TerminalOutputProps {
  output: string;
  state: OutputState;
  stderr?: string;
  onClear?: () => void;
}

export function TerminalOutput({ output, state, stderr, onClear }: TerminalOutputProps) {
  return (
    <div className="rounded-[var(--radius)] border border-border overflow-hidden font-mono text-sm">
      <div className="flex items-center justify-between bg-muted px-4 py-1.5 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
          </div>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium ml-2">
            Terminal
          </span>
        </div>
        {onClear && (
          <button
            onClick={onClear}
            className="text-[10px] text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider"
            aria-label="Clear output"
          >
            Clear
          </button>
        )}
      </div>

      <div className="bg-[#1e1e2e] dark:bg-[#11111b] min-h-[80px] p-4">
        <AnimatePresence mode="wait">
          {state === "idle" && (
            <motion.p
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-zinc-500 dark:text-zinc-600"
            >
              Click &ldquo;Run Code&rdquo; to execute...
            </motion.p>
          )}

          {state === "running" && (
            <motion.div
              key="running"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-zinc-400"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Running...
            </motion.div>
          )}

          {state === "success" && output && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
            >
              <div className="flex items-center gap-2 text-[10px] text-green-400 uppercase tracking-wider mb-2">
                <span>✓ Execution successful</span>
              </div>
              <pre className="text-green-100 whitespace-pre-wrap leading-relaxed">
                {output}
              </pre>
            </motion.div>
          )}

          {state === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
            >
              <div className="flex items-center gap-2 text-[10px] text-red-400 uppercase tracking-wider mb-2">
                <span>✗ Error</span>
              </div>
              <pre className="text-red-200 whitespace-pre-wrap leading-relaxed">
                {stderr || output || "An unknown error occurred"}
              </pre>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
