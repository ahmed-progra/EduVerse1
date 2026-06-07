const JUDGE0_URL = process.env.JUDGE0_URL ?? "https://ce.judge0.com";

const LANGUAGE_MAP: Record<string, number> = {
  python: 71,
  javascript: 63,
  js: 63,
  typescript: 74,
  ts: 74,
  java: 62,
  cpp: 54,
  c: 50,
  go: 60,
  ruby: 72,
  rust: 73,
  sql: 82,
  bash: 46,
  html: 80,
  css: 80,
};

export type ExecuteRequest = {
  language: string;
  code: string;
  stdin?: string;
};

export type ExecuteResult = {
  stdout: string;
  stderr: string;
  output: string;
  code: number;
};

// Bound every remote call so a slow/unreachable Judge0 instance can never hang
// the request — on timeout we throw and the route falls back to local execution.
const JUDGE0_TIMEOUT_MS = 7000;

export async function executeCode(request: ExecuteRequest): Promise<ExecuteResult> {
  const languageId = LANGUAGE_MAP[request.language];
  if (!languageId) {
    throw new Error(`Unsupported language: ${request.language}`);
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), JUDGE0_TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(`${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source_code: request.code,
        language_id: languageId,
        stdin: request.stdin ?? "",
      }),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Code execution failed: ${res.status} ${body}`);
  }

  const data = await res.json();

  return {
    stdout: data.stdout ?? "",
    stderr: data.stderr ?? "",
    output: (data.stdout ?? "") + (data.stderr ?? ""),
    code: data.status?.id ?? 0,
  };
}

export async function listLanguages(): Promise<{ id: number; name: string }[]> {
  const res = await fetch(`${JUDGE0_URL}/languages`);
  if (!res.ok) throw new Error("Failed to fetch languages");
  return res.json();
}
