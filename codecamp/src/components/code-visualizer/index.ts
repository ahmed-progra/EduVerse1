import type { ExecutionStep } from "@/lib/code-visualizer/types";

export { CodeVisualizer } from "./code-visualizer";

import { tracePython } from "@/lib/code-visualizer/python-tracer";
import { traceJavaScript } from "@/lib/code-visualizer/javascript-tracer";
import { traceHtmlCss } from "@/lib/code-visualizer/html-css-tracer";

export function traceCode(code: string, language: string): { steps: ExecutionStep[]; totalSteps: number; duration: number } {
  if (language === "python") return tracePython(code);
  if (language === "javascript" || language === "js") return traceJavaScript(code);
  if (language === "html" || language === "css") return traceHtmlCss(code, language);
  return { steps: [], totalSteps: 0, duration: 0 };
}
