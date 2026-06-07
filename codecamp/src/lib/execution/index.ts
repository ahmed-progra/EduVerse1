import { executeJavaScript } from "./javascript";

export type ExecutionMode = "judge0" | "local" | "preview";

export interface ExecutionRequest {
  language: string;
  code: string;
  stdin?: string;
}

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  output: string;
  mode: ExecutionMode;
}

export function executeLocal(request: ExecutionRequest): ExecutionResult {
  const { language, code } = request;

  switch (language) {
    case "javascript":
    case "js": {
      const result = executeJavaScript(code);
      return {
        stdout: result.stdout,
        stderr: result.stderr,
        output: result.stderr ? result.stderr : result.stdout,
        mode: "local",
      };
    }
    case "html": {
      return {
        stdout: "HTML preview rendered below.",
        stderr: "",
        output: "HTML preview rendered below.",
        mode: "preview",
      };
    }
    case "python": {
      const result = executePythonFallback(code);
      return {
        stdout: result.stdout,
        stderr: result.stderr,
        output: result.stderr ? result.stderr : result.stdout,
        mode: "local",
      };
    }
    case "cpp": {
      return {
        stdout: "",
        stderr: "C++ execution requires a remote compiler service (Judge0). Please ensure JUDGE0_URL is configured.",
        output: "C++ execution requires a remote compiler service (Judge0). Please ensure JUDGE0_URL is configured.",
        mode: "local",
      };
    }
    default:
      return {
        stdout: "",
        stderr: `Unsupported language for local execution: ${language}`,
        output: `Unsupported language for local execution: ${language}`,
        mode: "local",
      };
  }
}

function pyToJsLine(line: string): string {
  let js = line;

  const stringLiterals: string[] = [];
  const placeholderIndex: string[] = [];

  js = js.replace(/f?(["'`])((?:(?!\1|\\).|\\.)*?)\1/g, (match) => {
    const idx = stringLiterals.length;
    stringLiterals.push(match);
    placeholderIndex.push(`__STR${idx}__`);
    return `__STR${idx}__`;
  });

  js = js.replace(/\bTrue\b/g, "true");
  js = js.replace(/\bFalse\b/g, "false");
  js = js.replace(/\bNone\b/g, "null");
  js = js.replace(/\band\b/g, "&&");
  js = js.replace(/\bor\b/g, "||");
  js = js.replace(/\bnot\s+/g, "!");

  js = js.replace(/\blen\(/g, "__len(");
  js = js.replace(/\bprint\(/g, "__print(");
  js = js.replace(/\brange\(/g, "__range(");
  js = js.replace(/\binput\(/g, "__input(");

  placeholderIndex.forEach((ph, i) => {
    let literal = stringLiterals[i];
    if (literal.startsWith("f") || literal.startsWith("F")) {
      const inner = literal.slice(2, -1).replace(/\{(\w+(?:\[.+?\])?)\}/g, (_, v) => `\${${v}}`);
      literal = "`" + inner + "`";
    }
    js = js.replace(ph, literal);
  });

  return js;
}

function executePythonFallback(code: string): { stdout: string; stderr: string } {
  const outputs: string[] = [];

  const printFn = (...args: unknown[]) => {
    outputs.push(args.map((a) => (a == null ? "None" : String(a))).join(" "));
  };

  const lenFn = (x: unknown) => {
    if (typeof x === "string" || Array.isArray(x)) return x.length;
    if (x && typeof x === "object") return Object.keys(x as object).length;
    return 0;
  };

  const rangeFn = (...args: number[]): number[] => {
    let start = 0, end = 0, step = 1;
    if (args.length === 1) { end = args[0]; }
    else if (args.length === 2) { start = args[0]; end = args[1]; }
    else if (args.length >= 3) { start = args[0]; end = args[1]; step = args[2]; }
    const result: number[] = [];
    if (step > 0) { for (let i = start; i < end; i += step) result.push(i); }
    else if (step < 0) { for (let i = start; i > end; i += step) result.push(i); }
    return result;
  };

  const inputFn = (prompt = "") => {
    outputs.push(`${prompt} `);
    return "";
  };

  try {
    const lines = code.split("\n");
    // Stack holds the indent of each OPEN block's header line. A block opened by
    // a header at indent H has its body at indent > H, so the block is exited
    // when we reach a line at indent <= H.
    const stack: number[] = [];
    const jsLines: string[] = [];

    const closeBlocks = (threshold: number) => {
      while (stack.length > 0 && stack[stack.length - 1] >= threshold) {
        stack.pop();
        jsLines.push("}");
      }
    };

    for (const rawLine of lines) {
      const stmt = rawLine.trim();
      if (stmt === "" || stmt.startsWith("#")) continue;

      const indent = rawLine.length - rawLine.trimStart().length;
      const isContinuation = /^(else\s*:|elif\b|except\b|finally\b)/.test(stmt);

      // Regular lines close every block at >= their indent. Continuations
      // (else/elif/except/finally) close only strictly-deeper blocks and reuse
      // the matching header that sits at the same indent.
      closeBlocks(isContinuation ? indent + 1 : indent);

      if (stmt === "pass") continue;

      if (/^try\s*:$/.test(stmt)) {
        jsLines.push("try {");
        stack.push(indent);
        continue;
      }

      const exceptAs = stmt.match(/^except\s+.+\s+as\s+(\w+)\s*:$/);
      if (exceptAs) {
        jsLines.push(`} catch (${exceptAs[1]}) {`);
        continue;
      }
      if (/^except\b.*:$/.test(stmt)) {
        jsLines.push("} catch (e) {");
        continue;
      }
      if (/^finally\s*:$/.test(stmt)) {
        jsLines.push("} finally {");
        continue;
      }

      const ifMatch = stmt.match(/^if\s+(.+):$/);
      if (ifMatch) {
        jsLines.push(`if (${pyToJsLine(ifMatch[1])}) {`);
        stack.push(indent);
        continue;
      }

      const elifMatch = stmt.match(/^elif\s+(.+):$/);
      if (elifMatch) {
        jsLines.push(`} else if (${pyToJsLine(elifMatch[1])}) {`);
        continue;
      }

      if (stmt === "else:") {
        jsLines.push("} else {");
        continue;
      }

      const forMatch = stmt.match(/^for\s+(\w+)\s+in\s+(.+):$/);
      if (forMatch) {
        jsLines.push(`for (const ${forMatch[1]} of ${pyToJsLine(forMatch[2])}) {`);
        stack.push(indent);
        continue;
      }

      const whileMatch = stmt.match(/^while\s+(.+):$/);
      if (whileMatch) {
        jsLines.push(`while (${pyToJsLine(whileMatch[1])}) {`);
        stack.push(indent);
        continue;
      }

      const defMatch = stmt.match(/^def\s+(\w+)\s*\(([^)]*)\)\s*:\s*$/);
      if (defMatch) {
        jsLines.push(`function ${defMatch[1]}(${defMatch[2]}) {`);
        stack.push(indent);
        continue;
      }

      jsLines.push(pyToJsLine(stmt) + ";");
    }

    closeBlocks(0);

    const jsCode = jsLines.join("\n");

    // Pass the helpers as real arguments so they keep their closures over
    // `outputs`. Serializing them with .toString() would drop the closure and
    // throw "outputs is not defined" at runtime.
    const fn = new Function("__print", "__len", "__range", "__input", jsCode);
    fn(printFn, lenFn, rangeFn, inputFn);

    return { stdout: outputs.join("\n"), stderr: "" };
  } catch (err) {
    return {
      stdout: outputs.join("\n"),
      stderr: err instanceof Error ? err.message : String(err),
    };
  }
}
