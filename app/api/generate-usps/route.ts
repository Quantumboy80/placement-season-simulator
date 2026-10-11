import { NextResponse } from "next/server";
import { z } from "zod";
import { getClientIp, checkRateLimit } from "@/lib/rateLimit";
import { checkPayloadSize, logSecurityError, fetchWithTimeout, detectPromptInjection, sanitizeInputText } from "@/lib/security";
import { generateUSPOptions } from "@/lib/projectStrategyGenerator";

export const runtime = "nodejs";

// Zod payload validation schema
const uspsRequestSchema = z.object({
  selectedProblem: z.object({
    id: z.string().max(100),
    title: z.string().max(200),
    description: z.string().max(2000),
    category: z.string().max(100),
    difficulty: z.string().max(50),
    constraints: z.array(z.string().max(500)).max(5),
    bonusObjectives: z.array(z.string().max(500)).max(5).optional(),
    judgingHint: z.string().max(500).optional(),
  }).passthrough(),
  solutionDirection: z.string().max(100).optional(),
  techStack: z.array(
    z.object({
      id: z.string().max(100),
      name: z.string().max(100),
      category: z.string().max(100).optional(),
      difficulty: z.union([z.string().max(100), z.number()]).optional(),
    }).passthrough()
  ).max(25),
  gameMode: z.string().max(50).optional(),
  seed: z.union([z.string().max(100), z.number()]).optional(),
}).passthrough();


export async function POST(req: Request) {
  const contextName = "GenerateUSPsAPI";
  let payload: any = null;

  try {
    // 1. Method Validation
    if (req.method !== "POST") {
      return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
    }

    // 2. Payload Size Limit check (50KB max)
    const sizeCheck = checkPayloadSize(req, 50 * 1024);
    if (!sizeCheck.ok) {
      return NextResponse.json({ error: sizeCheck.error }, { status: 413 });
    }

    // 3. IP-based Rate Limiting (10 requests per minute)
    const clientIp = getClientIp(req);
    const rateLimit = checkRateLimit(clientIp, 10, 60 * 1000);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too Many Requests. Please cool down for a minute." },
        { 
          status: 429,
          headers: {
            "Retry-After": "60",
            "X-RateLimit-Limit": String(rateLimit.limit),
            "X-RateLimit-Remaining": String(rateLimit.remaining),
            "X-RateLimit-Reset": String(rateLimit.resetTime)
          }
        }
      );
    }

    // 4. Request Body Parsing & Validation (FIX: Parse exactly ONCE)
    try {
      payload = await req.json();
    } catch (parseErr) {
      return NextResponse.json({ error: "Malformed JSON payload" }, { status: 400 });
    }

    if (!payload) {
      return NextResponse.json({ error: "Missing game state payload" }, { status: 400 });
    }

    const validation = uspsRequestSchema.safeParse(payload);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid payload parameters", details: validation.error.format() },
        { status: 400 }
      );
    }

    const { selectedProblem, solutionDirection, techStack, gameMode, seed } = validation.data;

    // 5. Prompt Injection Checks on User-Controlled Fields
    const textToScan = [
      selectedProblem.title,
      selectedProblem.description,
      solutionDirection || "",
      ...selectedProblem.constraints,
    ].join(" ");

    if (detectPromptInjection(textToScan)) {
      logSecurityError(contextName, `Prompt injection attempt blocked: "${clientIp}"`);
      // Fail gracefully to fallback options instead of failing entirely
      const offlineUSPs = generateUSPOptions(selectedProblem as any, solutionDirection || null, techStack as any, gameMode || "easy", seed as any);
      return NextResponse.json({ usps: offlineUSPs, fallbackUsed: true, error: "Suspicious activity detected. Fallback activated." });
    }

    // Sanitize values to prevent XSS down the line
    const sanitizedProblem = {
      ...selectedProblem,
      title: sanitizeInputText(selectedProblem.title),
      description: sanitizeInputText(selectedProblem.description),
    };
    const sanitizedSolutionDirection = solutionDirection ? sanitizeInputText(solutionDirection) : "web-app";

    // 6. Secure Environment Variables Loading (Server-Only)
    const openaiKey = process.env.OPENAI_API_KEY;
    const openRouterKey = process.env.OPENROUTER_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    // Direct Fallback to Procedural offline USPs if no API keys configured
    if (!openaiKey && !openRouterKey && !geminiKey) {
      const offlineUSPs = generateUSPOptions(sanitizedProblem as any, sanitizedSolutionDirection, techStack as any, gameMode || "easy", seed as any);
      return NextResponse.json({ usps: offlineUSPs, fallbackUsed: true });
    }

    const systemPrompt = `You are a creative, expert placement coach.
Your task is to generate 6 highly unique, distinct, and creative "edges" (what sets a candidate apart) for a student preparing for a campus hiring drive.

IMPORTANT - LAYMAN LANGUAGE REQUIREMENT:
Write the title ("name") and description ("desc") of each USP in extremely simple, friendly, and layman-friendly English (layperson language).
- AVOID complex jargon (e.g. "Zero-configuration spaced-repetition scheduler engine", "Elastic event-driven vital telemetry locker").
- USE simple, direct words that anyone can instantly understand (e.g. "One-Click Quick Prep", "Instant Vital Alerts", "Free Shareable Budget").
- Make sure the titles and names sound exciting, clear, and highly distinct from each other!

Each USP must map to a specific archetype "key" and have balanced game metrics:
- "Consistency": steady daily practice and reliability. (High execution ~75-85, lower innovation ~40-50)
- "Self-Taught": learned from free resources and built things unprompted. (High execution ~70-80, lower design ~40-50)
- "Breadth": decent across aptitude, coding, core subjects and communication. (High pitch ~65-75, lower execution ~50-60)
- "Specialist": deep in one area that interviewers can probe three levels down. (High innovation ~80-90, lower execution ~45-55)
- "Research-Driven": research mindset with papers or experiments. (High pitch ~70-80, lower execution ~50-60)
- "Polished Profile": sharp resume, GitHub and LinkedIn that recruiters open. (High design ~75-85, lower execution ~50-60)
- "Network-First": strong alumni, senior and recruiter network for referrals. (High pitch ~70-80, lower design ~50-60)

You MUST return a raw, valid JSON array of exactly 6 USP objects. Do not include markdown wraps or explanations. Follow this JSON format strictly:
[
  {
    "key": "Consistency" | "Self-Taught" | "Breadth" | "Specialist" | "Research-Driven" | "Polished Profile" | "Network-First",
    "name": "layman-friendly creative name",
    "desc": "simple description of what this approach does",
    "innovation": integer between 35 and 90,
    "execution": integer between 35 and 90,
    "design": integer between 35 and 90,
    "pitch": integer between 35 and 90,
    "advantages": "layman benefit of this choice",
    "challenges": "layman drawback of this choice"
  }
]`;

    const userPrompt = `PROJECT SCENARIO DETAILS:
- SELECTED CHALLENGE: "${sanitizedProblem.title}" - "${sanitizedProblem.description}"
- CATEGORY: "${sanitizedProblem.category}"
- CHALLENGE CONSTRAINTS: ${JSON.stringify(sanitizedProblem.constraints)}
- SOLUTION FORMAT: "${sanitizedSolutionDirection}"
- SELECTED TECH STACK: ${JSON.stringify(techStack.slice(0, 4).map(t => t.name))}
Please output exactly 6 highly creative, layman-friendly USPs matching this context in strict JSON format. Select 6 distinct keys from the allowed list.`;

    let responseText = "";

    // 7. AI Completion with strict timeout limits (3000ms)
    if (openaiKey) {
      const response = await fetchWithTimeout("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          temperature: 0.8,
          max_tokens: 1000
        })
      }, 10000);

      if (!response.ok) {
        throw new Error(`OpenAI responded with status ${response.status}`);
      }

      const data = await response.json();
      responseText = data.choices?.[0]?.message?.content || "";
    } else if (openRouterKey) {
      const response = await fetchWithTimeout("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openRouterKey}`,
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "Placement Season Simulator",
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          temperature: 0.8,
          max_tokens: 1000
        })
      }, 10000);

      if (!response.ok) {
        throw new Error(`OpenRouter responded with status ${response.status}`);
      }

      const data = await response.json();
      responseText = data.choices?.[0]?.message?.content || "";
    } else if (geminiKey) {
      const response = await fetchWithTimeout("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-goog-api-key": geminiKey
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `${systemPrompt}\n\nHere are the details:\n${userPrompt}` }]
          }],
          generationConfig: { temperature: 0.8, maxOutputTokens: 1000 }
        })
      }, 10000);

      if (!response.ok) {
        throw new Error(`Gemini responded with status ${response.status}`);
      }

      const data = await response.json();
      responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    }

    // Clean JSON response
    let cleanedText = responseText.trim();
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText.slice(7);
    }
    if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.slice(3);
    }
    if (cleanedText.endsWith("```")) {
      cleanedText = cleanedText.slice(0, -3);
    }
    cleanedText = cleanedText.trim();

    // 8. Safely parse and sanitize LLM response array
    const usps = JSON.parse(cleanedText);
    if (Array.isArray(usps) && usps.length > 0) {
      const sanitizedUsps = usps.map((u: any) => ({
        key: typeof u.key === "string" ? u.key.replace(/[<>]/g, "") : "Consistency",
        name: typeof u.name === "string" ? sanitizeInputText(u.name) : "USP Advantage",
        desc: typeof u.desc === "string" ? sanitizeInputText(u.desc) : "Simple description.",
        innovation: typeof u.innovation === "number" ? Math.max(35, Math.min(90, u.innovation)) : 60,
        execution: typeof u.execution === "number" ? Math.max(35, Math.min(90, u.execution)) : 60,
        design: typeof u.design === "number" ? Math.max(35, Math.min(90, u.design)) : 60,
        pitch: typeof u.pitch === "number" ? Math.max(35, Math.min(90, u.pitch)) : 60,
        advantages: typeof u.advantages === "string" ? sanitizeInputText(u.advantages) : "High advantage",
        challenges: typeof u.challenges === "string" ? sanitizeInputText(u.challenges) : "Low execution friction",
      })).slice(0, 6);

      return NextResponse.json({ usps: sanitizedUsps, fallbackUsed: false });
    }
    throw new Error("Invalid structure returned from AI model");
  } catch (parseErr) {
    logSecurityError(contextName, parseErr);
    
    // Safely trigger offline fallback using cached payload variables
    try {
      const offlineUSPs = generateUSPOptions(
        (payload?.selectedProblem || {}) as any,
        payload?.solutionDirection || "web-app",
        (payload?.techStack || []) as any,
        payload?.gameMode,
        payload?.seed as any
      );
      return NextResponse.json({ usps: offlineUSPs, fallbackUsed: true, error: "Parsed LLM content was invalid, falling back." });
    } catch (fallbackErr) {
      return NextResponse.json({ error: "Failed to generate USPs securely." }, { status: 500 });
    }
  }
}
