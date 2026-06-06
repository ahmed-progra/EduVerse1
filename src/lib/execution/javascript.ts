export function executeJavaScript(code: string): { stdout: string; stderr: string } {
  const logs: string[] = [];
  const errors: string[] = [];

  const mockConsole = {
    log: (...args: unknown[]) => {
      logs.push(args.map((a) => (typeof a === "object" ? JSON.stringify(a, null, 2) : String(a))).join(" "));
    },
    error: (...args: unknown[]) => {
      errors.push(args.map((a) => String(a)).join(" "));
    },
    warn: (...args: unknown[]) => {
      logs.push(`warn: ${args.map((a) => String(a)).join(" ")}`);
    },
    info: (...args: unknown[]) => {
      logs.push(`info: ${args.map((a) => String(a)).join(" ")}`);
    },
  };

  try {
    const fn = new Function("console", code);
    fn(mockConsole);
    return { stdout: logs.join("\n"), stderr: errors.join("\n") };
  } catch (err) {
    return {
      stdout: logs.join("\n"),
      stderr: errors.join("\n") + (err instanceof Error ? err.message : String(err)),
    };
  }
}
