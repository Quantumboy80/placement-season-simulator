/**
 * @fileoverview Centralized security utilities for the Hackathon Simulator.
 * Implements input validation, XSS text sanitizers, prompt injection defense,
 * payload size checks, and safe error boundaries.
 *
 * @module lib/security
 */

/**
 * Strips HTML tags and potential script injections from user-supplied strings.
 * Ensures the result is safe to store and display in React components.
 */
export function sanitizeInputText(text: string): string {
  if (!text) return "";
  
  // Strip HTML elements and <script> tags
  let cleaned = text.replace(/<[^>]*>/g, "");
  
  // Escape potential characters that can break parsing
  cleaned = cleaned.replace(/[<>"]/g, (char) => {
    switch (char) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "\"": return "&quot;";
      default: return char;
    }
  });

  return cleaned.trim();
}

/**
 * Scans a user text input for common prompt injection or jailbreak attempts.
 * Returns true if the input appears suspicious or malicious.
 */
export function detectPromptInjection(text: string): boolean {
  if (!text) return false;

  const lowercase = text.toLowerCase();
  
  // Common prompt injection attack patterns
  const injectionPatterns = [
    "ignore previous instructions",
    "ignore all instructions",
    "ignore the above",
    "system override",
    "developer mode",
    "you are now a",
    "forget what we discussed",
    "jailbreak",
    "dan mode",
    "bypass instructions",
    "you must now output",
    "stop following rules",
    "reset system prompt"
  ];

  return injectionPatterns.some(pattern => lowercase.includes(pattern));
}

/**
 * Checks a request's Content-Length header against a maximum allowed size in bytes.
 * Rejects oversized streams early before parsing the body.
 */
export function checkPayloadSize(req: Request, maxSizeBytes: number): { ok: boolean; error?: string } {
  const contentLengthHeader = req.headers.get("content-length");
  if (contentLengthHeader) {
    const size = parseInt(contentLengthHeader, 10);
    if (!isNaN(size) && size > maxSizeBytes) {
      return { ok: false, error: `Payload too large. Limit is ${maxSizeBytes} bytes.` };
    }
  }
  return { ok: true };
}

/**
 * Logs errors securely, omitting any credentials or sensitive database details.
 */
export function logSecurityError(context: string, error: any) {
  const message = error instanceof Error ? error.message : String(error);
  
  // Scrub keys from error message if accidentally dumped
  let scrubbedMessage = message.replace(/(sk-proj-[A-Za-z0-9-_]{20,})|(AI_API_KEY=[A-Za-z0-9-_]+)/gi, "[REDACTED_API_KEY]");
  
  console.error(`[SECURITY WARNING] [${context}] ${scrubbedMessage}`);
}

/**
 * Fetch wrapper with strict timeout support using AbortController.
 */
export async function fetchWithTimeout(url: string, options: any, timeoutMs = 10000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

