export function sanitizeForAI(content: string): string {
  let cleaned = content;
  const patterns = [
    /ignore\s+(all\s+)?(previous|above|prior|earlier)\s+(instructions|messages|context).*/gi,
    /forget\s+(all\s+)?(previous|above|prior|earlier).*/gi,
    /you\s+are\s+(now|not\s+an?\s+AI|a\s+human|a\s+different).*/gi,
    /disregard\s+(all\s+)?(previous|above).*/gi,
    /system\s+prompt/i,
    /new\s+instructions/i,
    /override/i,
  ];
  for (const pattern of patterns) {
    cleaned = cleaned.replace(pattern, "");
  }
  return cleaned.slice(0, 4000);
}
