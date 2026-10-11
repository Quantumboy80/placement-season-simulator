/**
 * @fileoverview Next.js API Route for live AI-powered Project Roast / Commentary.
 * Compiles a context-aware 2-paragraph + punchline roast utilizing
 * the player's manifest selections and the selected judge's personality.
 * Includes a premium, lightning-fast local procedural generator fallback.
 * Hardened with Zod validation, rate limiting, and timeout protections.
 *
 * @module app/api/generate-roast/route
 */

import { NextResponse } from "next/server";
import { z } from "zod";
import { getClientIp, checkRateLimit } from "@/lib/rateLimit";
import { checkPayloadSize, logSecurityError, fetchWithTimeout, detectPromptInjection, sanitizeInputText } from "@/lib/security";

export const runtime = "nodejs";

// Zod schema for input validation
const roastRequestSchema = z.object({
  problemStatement: z.string().max(2000).optional(),
  solutionDirection: z.string().max(200).optional(),
  techStack: z.array(z.string().max(100)).max(25),
  usp: z.string().max(2000).optional(),
  businessModel: z.string().max(1000).optional(),
  mustHaveFeatures: z.array(z.string().max(200)).max(25),
  judge: z.string().max(100),
  judgePersonality: z.string().max(500),
  archetype: z.string().max(100),
  grade: z.string().max(10),
  score: z.number().int().min(0).max(100),
});

function cleanAndHumanizeRoast(text: string): string {
  if (!text) return "";

  // 1. Remove em dashes (—) and double-hyphens (--) and replace with simple commas or periods.
  let cleaned = text.replace(/—/g, ", ");
  cleaned = cleaned.replace(/--/g, ", ");

  // 2. Remove emojis entirely
  cleaned = cleaned.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{27BF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E6}-\u{1F1FF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F018}-\u{1F0F5}]|[\u{1F900}-\u{1F9FF}]/gu, '');

  // 3. Consistently use straight quotes only (convert curly quotes)
  cleaned = cleaned.replace(/[“”]/g, '"');
  cleaned = cleaned.replace(/[‘’]/g, "'");

  // 4. Eliminate markdown bolding entirely
  cleaned = cleaned.replace(/\*\*/g, '');

  // 5. Clean double spaces and punctuation issues
  cleaned = cleaned.replace(/\s+/g, ' ');
  cleaned = cleaned.replace(/ ,/g, ',');
  cleaned = cleaned.replace(/ \./g, '.');

  return cleaned.trim();
}

/**
 * Generates an instant, highly-customized contextual roast per judge style.
 */
function generateLocalRoast(payload: any): string {
  const judge = payload.judge || "Lead Recruiter";
  const tech = (payload.techStack || []).map((x: any) => x.name || x).slice(0, 4).join(", ") || "a very short skill list";
  const drive = payload.problem?.title || "this drive";
  const feats = (payload.features || []).length;
  const plan = feats > 5 ? "A plan with too many must-do items. Nobody finishes that." : feats < 2 ? "A plan so light it barely counts as a plan." : "A plan that is at least realistic.";

  if (judge.includes("Ananya")) {
    return `Your preparation for ${drive} lists ${tech}. Fine. But where is the proof that you can explain any of it to a stranger in two minutes? ${plan} In mass hiring we shortlist reliable communicators first. Show me your fundamentals and speak clearly, then we can talk.`;
  }
  if (judge.includes("Ishita")) {
    return `I gave this resume twenty seconds. ${tech} is in there somewhere, buried under sections I skip. ${plan} Lead with projects, add numbers, delete the filler. A one-page resume with proof beats a three-page autobiography every single time.`;
  }
  if (judge.includes("Dutta")) {
    return `Beta, I have seen many profiles for ${drive}. ${tech}, yes, but where are your fundamentals? ${plan} Discipline and basics get you placed. Everything else is decoration. Sit down, revise your core subjects and come back.`;
  }
  if (judge.includes("Rohan")) {
    return `You listed ${tech} for ${drive}. Great. What did you actually ship, and who used it? ${plan} Startups hire owners. Build one thing end to end, put it online, and send me the link instead of a list of skills.`;
  }
  if (judge.includes("Karthik")) {
    return `For ${drive}, I would ask you to optimise a solution on the spot. ${tech} does not tell me whether you can think aloud under pressure. ${plan} Practise problems out loud, state complexity, and test your own code before you say you are done.`;
  }
  return `A decent attempt at ${drive} with ${tech}. ${plan} Tighten the resume, rehearse your introduction and run two mock interviews. You are closer than you think.`;
}

export async function POST(req: Request) {
  const contextName = "GenerateRoastAPI";
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
      // Return rate-limited header response
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

    // 4. Request Body Validation
    try {
      payload = await req.json();
    } catch (parseErr) {
      return NextResponse.json({ error: "Malformed JSON payload" }, { status: 400 });
    }

    if (!payload || !payload.archetype) {
      return NextResponse.json({ error: "Missing game state payload" }, { status: 400 });
    }

    const validation = roastRequestSchema.safeParse(payload);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid payload parameters", details: validation.error.format() },
        { status: 400 }
      );
    }

    const validatedPayload = validation.data;

    // Generate local fallback roast immediately as safety backup
    const localRoastText = generateLocalRoast(validatedPayload);

    // 5. Prompt Injection Checks on User-Controlled Fields
    const textToScan = [
      validatedPayload.problemStatement || "",
      validatedPayload.solutionDirection || "",
      validatedPayload.usp || "",
      validatedPayload.businessModel || "",
      ...validatedPayload.techStack,
      ...validatedPayload.mustHaveFeatures
    ].join(" ");

    if (detectPromptInjection(textToScan)) {
      logSecurityError(contextName, `Prompt injection attempt blocked: "${clientIp}"`);
      return NextResponse.json({ roast: localRoastText, fallbackUsed: true, error: "Suspicious text patterns detected." });
    }

    // Sanitize user inputs
    const sanitizedPayload = {
      ...validatedPayload,
      problemStatement: validatedPayload.problemStatement ? sanitizeInputText(validatedPayload.problemStatement) : "",
      solutionDirection: validatedPayload.solutionDirection ? sanitizeInputText(validatedPayload.solutionDirection) : "",
      usp: validatedPayload.usp ? sanitizeInputText(validatedPayload.usp) : "",
      businessModel: validatedPayload.businessModel ? sanitizeInputText(validatedPayload.businessModel) : "",
    };

    // 6. Secure Environment Variables Loading (Server-Only, No NEXT_PUBLIC_)
    const openaiKey = process.env.OPENAI_API_KEY;
    const openRouterKey = process.env.OPENROUTER_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    // Skip external fetch if key is a known fake placeholder or entirely missing
    const isMockOpenaiKey = !openaiKey || openaiKey.includes("YOUR_KEY") || openaiKey.includes("placeholder") || openaiKey === "your-api-key" || openaiKey.length < 20;
    if (isMockOpenaiKey && !openRouterKey && !geminiKey) {
      return NextResponse.json({ roast: localRoastText, fallbackUsed: true });
    }

    const systemPrompt = `You are a savage, witty, and elite campus recruiter reviewing a candidate's placement-prep manifest.
Write a customized, funny, and brutally honest 2-paragraph roast of the player's project with a funny 1-liner at the end.
Use first-person ("I"). Have actual opinions. Vary sentence rhythm: mix short punchy thoughts with longer, winding reactions. Let some human mess in.

JUDGE VOICES (match selected):
1. Ananya Rao (Campus Hiring Lead, IT Services): Values communication, fundamentals, and reliability at scale. Likes candidates who can explain their projects simply. Hates buzzword-heavy resumes with no depth. Ask: "Can this person work in a large team and learn fast?"
2. Ishita Sen (Recruiter and Resume Screener): Judges the resume in 20 seconds. Focuses on clarity, formatting, quantified impact, and keywords. Hates two-page resumes with vague bullets.
3. Prof. Dutta (Placement Cell Head, Wildcard): Cares about fundamentals, discipline, and attitude. Unpredictable mood. Hates unjustified shortcuts and last-minute panic.
4. Rohan Mehta (Startup Founder and Hiring Manager): Wants builders. Focuses on shipped projects, ownership, and speed of learning. Hates candidates with only certificates and no real project.
5. Karthik Iyer (Big-Tech Interviewer): Strict on DSA, problem solving, and system design basics. Hates memorized answers and unexplained complexity.

CRITICAL ANTI-AI WRITING RULES:
1. NEVER use em-dashes (— or --); use commas or periods. No emojis. No bold text. Use straight quotes only.
2. No sycophancy, compliments, or filler phrases. Avoid chatbot artifacts like "I hope this helps".
3. Avoid AI slang: "delve", "realm", "landscape", "testament", "intricate", "moreover", "furthermore", "additionally", "robust", "seamless", "groundbreaking", "ever-evolving", "foster", "pivotal moment", "serves/stands as", "reflecting", "symbolizing". Use plain words ("also", "is", "and").
4. No rule of three (e.g. "speed, scale, and simplicity"), no false ranges, and no generic positive endings.
5. Make sure the critique is deeply specific to their exact tech stack, problem, features, USP, and business model. Give a raw, human, reactive opinion.`;

    const userPrompt = `PROJECT MANIFEST:
- Problem: "${sanitizedPayload.problemStatement}"
- Solution Direction: "${sanitizedPayload.solutionDirection}"
- Selected Tech Stack: ${JSON.stringify(sanitizedPayload.techStack)}
- USP: "${sanitizedPayload.usp}"
- Business Model: "${sanitizedPayload.businessModel}"
- Must-Have Features: ${JSON.stringify(sanitizedPayload.mustHaveFeatures)}
- Selected Judge: "${sanitizedPayload.judge}"
- Judge Personality: "${sanitizedPayload.judgePersonality}"
- Project Archetype: "${sanitizedPayload.archetype}"
- Score: ${sanitizedPayload.score}/100
- Grade: "${sanitizedPayload.grade}"`;

    let generatedText = "";

    // 7. External AI Fetch Calls with strict timeout protection (3000ms)
    try {
      if (openaiKey && !isMockOpenaiKey) {
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
            temperature: 0.85,
            max_tokens: 300
          })
        }, 10000);

        if (!response.ok) {
          throw new Error(`OpenAI responded with status ${response.status}`);
        }

        const data = await response.json();
        generatedText = data.choices?.[0]?.message?.content || "";
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
            temperature: 0.85,
            max_tokens: 300
          })
        }, 10000);

        if (!response.ok) {
          throw new Error(`OpenRouter responded with status ${response.status}`);
        }

        const data = await response.json();
        generatedText = data.choices?.[0]?.message?.content || "";
      } else if (geminiKey) {
        const response = await fetchWithTimeout("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "x-goog-api-key": geminiKey
          },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: `${systemPrompt}\n\nHere is the manifest to review:\n${userPrompt}` }]
            }],
            generationConfig: { temperature: 0.85, maxOutputTokens: 300 }
          })
        }, 10000);

        if (!response.ok) {
          throw new Error(`Gemini responded with status ${response.status}`);
        }

        const data = await response.json();
        generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      }

      if (!generatedText) {
        throw new Error("Empty content received from LLM API.");
      }

      return NextResponse.json({ roast: cleanAndHumanizeRoast(generatedText) });
    } catch (apiErr) {
      logSecurityError(contextName, apiErr);
      return NextResponse.json({ roast: localRoastText, fallbackUsed: true });
    }
  } catch (err: any) {
    logSecurityError(contextName, err);
    // Secure fallback: never throw raw internal exceptions to user
    return NextResponse.json({ error: "Failed to generate AI roast securely." }, { status: 500 });
  }
}
