import type { ExecutionStep, CallFrame, TraceData } from "./types";

function parseTags(html: string): string[] {
  const tags: string[] = [];
  const re = /<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g;
  let match;
  while ((match = re.exec(html)) !== null) {
    tags.push(match[1].toLowerCase());
  }
  return tags;
}

function cssRules(css: string): { selector: string; props: string[] }[] {
  const rules: { selector: string; props: string[] }[] = [];
  const blockRe = /([^{]+)\{([^}]+)\}/g;
  let match;
  while ((match = blockRe.exec(css)) !== null) {
    const selector = match[1].trim();
    const props = match[2].split(";").map((p) => p.trim()).filter(Boolean);
    rules.push({ selector, props });
  }
  return rules;
}

function textContent(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

export function traceHtmlCss(code: string, language: string): TraceData {
  const steps: ExecutionStep[] = [];

  if (language === "css") {
    const rules = cssRules(code);
    rules.forEach((rule, i) => {
      const scope: Record<string, string> = {};
      rule.props.forEach((p) => {
        const [k, ...rest] = p.split(":");
        if (k) scope[k.trim()] = rest.join(":").trim();
      });
      const callStack: CallFrame[] = [{
        functionName: "<stylesheet>",
        line: i + 1,
        variables: [],
        locals: scope,
      }];
      steps.push({
        line: i + 1,
        column: 0,
        event: "line",
        functionName: "<stylesheet>",
        callStack,
        globals: { selector: rule.selector },
        stdout: `Applied ${rule.selector} { ${rule.props.join("; ")} }`,
      });
    });
    return { language: "css", code, steps, totalSteps: steps.length, duration: 0 };
  }

  const lines = code.split("\n");
  const tags = parseTags(code);
  const total = textContent(code);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("<!--") || trimmed.startsWith("/*")) continue;

    const openMatch = trimmed.match(/<([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>/);
    const closeMatch = trimmed.match(/<\/([a-zA-Z][a-zA-Z0-9]*)>/);
    const tagName = openMatch?.[1] ?? closeMatch?.[1] ?? null;

    const isOpen = !!openMatch;
    const isClose = !!closeMatch;
    const selfClosing = isOpen && trimmed.endsWith("/>");

    const attrs: Record<string, string> = {};
    if (openMatch?.[2]) {
      const attrRe = /(\w+)(?:="([^"]*)")?/g;
      let m;
      while ((m = attrRe.exec(openMatch[2])) !== null) {
        attrs[m[1]] = m[2] ?? "";
      }
    }

    steps.push({
      line: i + 1,
      column: 0,
      event: "line",
      functionName: "<document>",
      callStack: [{
        functionName: "<document>",
        line: i + 1,
        variables: [],
        locals: { tag: tagName ?? "text", attributes: Object.keys(attrs).length > 0 ? Object.entries(attrs).map(([k, v]) => `${k}=${v}`).join(" ") : "(none)" },
      }],
      globals: { tagsFound: Array.from(new Set(tags)).join(", "), totalTextLength: String(total.length) },
      stdout: `${isOpen ? (selfClosing ? "◇" : "▶") : isClose ? "◀" : " "} ${tagName || "text node"}${Object.keys(attrs).length > 0 ? ` [${Object.entries(attrs).map(([k, v]) => `${k}="${v}"`).join(", ")}]` : ""}${selfClosing ? " (self-closing)" : ""}`,
    });
  }

  return { language: "html", code, steps, totalSteps: steps.length, duration: 0 };
}
