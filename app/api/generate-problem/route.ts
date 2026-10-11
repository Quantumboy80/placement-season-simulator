import { NextResponse } from "next/server";
import { z } from "zod";
import { getClientIp, checkRateLimit } from "@/lib/rateLimit";
import { checkPayloadSize, logSecurityError, fetchWithTimeout } from "@/lib/security";

export const runtime = "nodejs";

// Payload validation schema (problem generation accepts optional empty body)
const requestSchema = z.object({}).strict().optional();

export async function POST(req: Request) {
  const contextName = "GenerateProblemAPI";

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

    // 4. Request Body Validation
    let rawBody = {};
    try {
      const text = await req.text();
      if (text) {
        rawBody = JSON.parse(text);
      }
    } catch (parseErr) {
      return NextResponse.json({ error: "Malformed JSON payload" }, { status: 400 });
    }

    const validation = requestSchema.safeParse(rawBody);
    if (!validation.success) {
      return NextResponse.json({ error: "Invalid payload parameters" }, { status: 400 });
    }

    // 5. Secure Environment Variables Loading (Server-Only, No NEXT_PUBLIC_)
    const openaiKey = process.env.OPENAI_API_KEY;
    const openRouterKey = process.env.OPENROUTER_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    if (!openaiKey && !openRouterKey && !geminiKey) {
      logSecurityError(contextName, "No AI keys configured on the server.");
      return NextResponse.json({ error: "AI service is currently offline. No keys configured." }, { status: 400 });
    }

    const categories = ["it-services", "product", "startup", "core-engg", "data-ai", "govt-psu", "bfsi-consulting"];
    const difficulties = ["beginner", "intermediate", "advanced"];
    
    // Pick random category and difficulty to suggest to the LLM
    const suggestedCategory = categories[Math.floor(Math.random() * categories.length)];
    const suggestedDifficulty = difficulties[Math.floor(Math.random() * difficulties.length)];

    const systemPrompt = `You are a campus placement coordinator at an engineering college in India.
Your job is to generate a realistic, fictional company hiring drive for freshers (invent a company name, never use a real one).
The drive MUST be realistic, clearly described and perfectly formatted. The "title" must look like "CompanyName: Role".

You must return a single JSON object matching this TypeScript structure:
{
  "id": string (e.g. "prob-gen-" followed by a short unique slug),
  "title": string (an exciting, professional project/challenge title),
  "description": string (detailed description of the challenge and real-world problem it solves, about 1-2 sentences),
  "category": "it-services" | "product" | "startup" | "core-engg" | "data-ai" | "govt-psu" | "bfsi-consulting",
  "difficulty": "beginner" | "intermediate" | "advanced",
  "constraints": string[] (exactly 2 strict, challenging engineering constraints/rules),
  "bonusObjectives": string[] (exactly 1 bonus objective / stretch goal),
  "judgingHint": string (a valuable tip from the recruiters, start with emoji 💡)
}

Ensure the output is valid, raw JSON. Do not wrap it in markdown code blocks or explanations.`;

    const userPrompt = `Generate a unique campus hiring drive:
- Category suggestion: "${suggestedCategory}"
- Difficulty suggestion: "${suggestedDifficulty}"
Make sure the challenge is highly creative, realistic, and completely different from generic examples. Output only raw JSON.`;

    let responseText = "";

    // 6. External AI Fetch Calls with strict timeout protection (3000ms)
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
          temperature: 0.9,
          max_tokens: 600
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
          temperature: 0.9,
          max_tokens: 600
        })
      }, 10000);

      if (!response.ok) {
        throw new Error(`OpenRouter responded with status ${response.status}`);
      }
      const data = await response.json();
      responseText = data.choices?.[0]?.message?.content || "";
    } else if (geminiKey) {
      // Secure key passed in header, not in URL parameters
      const response = await fetchWithTimeout("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-goog-api-key": geminiKey
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }]
          }],
          generationConfig: { temperature: 0.9, maxOutputTokens: 600 }
        })
      }, 10000);

      if (!response.ok) {
        throw new Error(`Gemini responded with status ${response.status}`);
      }
      const data = await response.json();
      responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    }

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

    // 7. Parse and Sanitize the LLM response
    const generatedProblem = JSON.parse(cleanedText);
    
    // Strict schema check on LLM structure to prevent downstream XSS or malformed fields
    if (
      generatedProblem &&
      typeof generatedProblem.title === "string" &&
      typeof generatedProblem.description === "string" &&
      Array.isArray(generatedProblem.constraints)
    ) {
      // Sanitize fields before sending to client
      const sanitizedProblem = {
        id: typeof generatedProblem.id === "string" ? generatedProblem.id.replace(/[<>"]/g, "") : `prob-gen-${Date.now()}`,
        title: generatedProblem.title.replace(/[<>]/g, ""),
        description: generatedProblem.description.replace(/[<>]/g, ""),
        category: categories.includes(generatedProblem.category) ? generatedProblem.category : suggestedCategory,
        difficulty: difficulties.includes(generatedProblem.difficulty) ? generatedProblem.difficulty : suggestedDifficulty,
        constraints: generatedProblem.constraints.map((c: string) => String(c).replace(/[<>]/g, "")).slice(0, 2),
        bonusObjectives: Array.isArray(generatedProblem.bonusObjectives) 
          ? generatedProblem.bonusObjectives.map((b: string) => String(b).replace(/[<>]/g, "")).slice(0, 1)
          : ["Implement fully offline capability."],
        judgingHint: typeof generatedProblem.judgingHint === "string" 
          ? generatedProblem.judgingHint.replace(/[<>]/g, "") 
          : "💡 Focus on simplicity."
      };

      return NextResponse.json({ problem: sanitizedProblem });
    }
    throw new Error("Invalid structure returned from AI model");
  } catch (err: any) {
    logSecurityError(contextName, err);
    return NextResponse.json({ error: "Failed to generate problem challenge securely." }, { status: 500 });
  }
}
