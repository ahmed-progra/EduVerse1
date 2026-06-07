import type { ExecutionStep, TraceData, CallFrame } from "./types";

const MAX_STEPS = 800;

function pyRepr(v: unknown): string {
  if (v === null || v === undefined) return "null";
  if (typeof v === "boolean") return v ? "true" : "false";
  if (typeof v === "string") return `'${v}'`;
  if (Array.isArray(v)) return `[${v.map(pyRepr).join(", ")}]`;
  if (typeof v === "object") {
    const entries = Object.entries(v as Record<string, unknown>);
    return `{${entries.map(([k, val]) => `${k}: ${pyRepr(val)}`).join(", ")}}`;
  }
  if (typeof v === "function") return "[Function]";
  return String(v);
}

function instrumentLine(line: string, lineNum: number): string {
  const js = line.trim();
  if (!js || js.startsWith("//") || js.startsWith("/*")) return "";

  const isBlock = /^(if|else|for|while|do|switch|case|try|catch|finally|function)\b/.test(js);
  const isBlockEnd = js === "}" || js === "});";

  if (isBlock || isBlockEnd || js.endsWith("{") || js.endsWith("}")) {
    if (js.endsWith("{")) {
      const before = js.slice(0, -1).trimEnd();
      return `${before} { __trace(${lineNum}, 'line');`;
    }
    return js;
  }

  const isExpr = js.endsWith(";");
  const cleanJs = isExpr ? js.slice(0, -1) : js;

  const varAssignMatch = cleanJs.match(/^(?:let|const|var)\s+(\w+)\s*=\s*(.+)$/);
  const assignMatch = cleanJs.match(/^(\w+)\s*=\s*(.+)$/);

  if (varAssignMatch) {
    const [, name, expr] = varAssignMatch;
    return `let ${name} = (__trace(${lineNum}, 'variable_change', '${name}', ${expr}), ${expr});`;
  }

  if (assignMatch) {
    const [, name, expr] = assignMatch;
    if (!/^(if|else|for|while|do|switch|return|throw|function|class)\b/.test(name)) {
      return `${name} = (__trace(${lineNum}, 'variable_change', '${name}', ${name} = ${expr}), ${name});`;
    }
  }

  const returnMatch = cleanJs.match(/^return\s+(.+)$/);
  if (returnMatch) {
    return `__trace(${lineNum}, 'return'); return ${returnMatch[1]};`;
  }

  if (js.startsWith("console.log(")) {
    const args = js.replace(/^console\.log\(/, "").replace(/\)\s*;?$/, "");
    return `__print(${args}); __trace(${lineNum}, 'line');`;
  }

  if (js.startsWith("console.error(")) {
    const args = js.replace(/^console\.error\(/, "").replace(/\)\s*;?$/, "");
    return `__printErr(${args}); __trace(${lineNum}, 'line');`;
  }

  return `__trace(${lineNum}, 'line'); ${js}`;
}

export function traceJavaScript(code: string): TraceData {
  const lines = code.split("\n");
  const steps: ExecutionStep[] = [];
  let stdout = "";

  const scope: Record<string, unknown> = {};

  function snapshot(): Record<string, string> {
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(scope)) {
      if (typeof v !== "function") out[k] = pyRepr(v);
    }
    return out;
  }

  function __trace(line: number, event: string, varName?: string, varValue?: unknown) {
    if (steps.length >= MAX_STEPS) throw new Error("Step limit reached");
    if (varName !== undefined && event === "variable_change") {
      scope[varName] = varValue;
    }
    const callStack: CallFrame[] = [{
      functionName: "<module>",
      line,
      variables: [],
      locals: {},
    }];
    steps.push({
      line,
      column: 0,
      event: event as ExecutionStep["event"],
      functionName: "<module>",
      callStack,
      globals: snapshot(),
      stdout,
    });
  }

  function __print(...args: unknown[]) {
    stdout += (stdout ? "\n" : "") + args.map((a) => (typeof a === "object" ? JSON.stringify(a, null, 2) : String(a))).join(" ");
  }

  function __printErr(...args: unknown[]) {
    stdout += (stdout ? "\n" : "") + "Error: " + args.map(String).join(" ");
  }

  const instrumentedLines: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    const il = instrumentLine(lines[i], i + 1);
    if (il) instrumentedLines.push(il);
  }

  const jsCode = instrumentedLines.join("\n");

  try {
    const fn = new Function("__trace", "__print", "__printErr", jsCode);
    fn(__trace, __print, __printErr);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (steps.length === 0) {
      steps.push({
        line: 1,
        column: 0,
        event: "exception",
        functionName: "<module>",
        callStack: [],
        globals: {},
        stdout: msg,
      });
    } else {
      steps.push({
        line: steps[steps.length - 1].line,
        column: 0,
        event: "exception",
        functionName: "<module>",
        callStack: [],
        globals: snapshot(),
        stdout: stdout + (stdout ? "\n" : "") + `Error: ${msg}`,
      });
    }
  }

  return { language: "javascript", code, steps, totalSteps: steps.length, duration: 0 };
}
