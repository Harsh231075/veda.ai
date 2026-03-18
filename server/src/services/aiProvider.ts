import { generateAssessment as generateWithGemini, AIProviderError } from "./aiService";
import { buildAssessmentPrompt, normalizeAssessment, QuestionConfig } from "./assessment";

const safeJsonParse = (text: string): unknown => {
  const trimmed = text.trim();
  // Handle common "```json ...```" wrappers defensively
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  const toParse = fenced ? fenced[1] : trimmed;
  return JSON.parse(toParse);
};

const parseAndValidateAssessment = (rawContent: string, providerName: string) => {
  let parsed: unknown;
  try {
    parsed = safeJsonParse(rawContent);
  } catch (e: any) {
    throw new AIProviderError(
      "AI_PROVIDER_BAD_OUTPUT",
      `${providerName} returned non-JSON output. Enforce JSON-only output or reduce prompt size.`
    );
  }

  try {
    return normalizeAssessment(parsed);
  } catch {
    const preview = rawContent.trim().slice(0, 800);
    throw new AIProviderError(
      "AI_PROVIDER_BAD_OUTPUT",
      `${providerName} returned JSON but it did not match the expected schema. Preview: ${preview}`
    );
  }
};

const getProvider = (): string => {
  return (process.env.AI_PROVIDER || process.env.GEMINI_PROVIDER || "gemini").toLowerCase();
};

const openAICall = async (promptText: string) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new AIProviderError("AI_PROVIDER_MISCONFIGURED", "OPENAI_API_KEY not set in environment");
  }

  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const maxTokens = Number(process.env.OPENAI_MAX_TOKENS || "2048");

  console.log("[OpenAI] Prompt:\n", promptText);
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: promptText }],
      max_tokens: maxTokens,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    // Map common errors
    if (res.status === 429) {
      const retryAfter = res.headers.get("retry-after");
      const retryMs = retryAfter ? Number(retryAfter) * 1000 : undefined;
      throw new AIProviderError("AI_PROVIDER_RATE_LIMIT", `OpenAI rate limited: ${body}`, { retryAfterMs: retryMs });
    }
    if (res.status === 401 || res.status === 400) {
      throw new AIProviderError("AI_PROVIDER_MISCONFIGURED", `OpenAI API error: ${body}`);
    }
    throw new AIProviderError("AI_PROVIDER_ERROR", `OpenAI API failed: ${body}`);
  }

  const json = await res.json();
  const content: string | undefined = json?.choices?.[0]?.message?.content;
  console.log("[OpenAI] Raw response JSON:\n", JSON.stringify(json, null, 2));
  if (!content) {
    throw new AIProviderError("AI_PROVIDER_ERROR", "OpenAI response missing choices[0].message.content");
  }
  console.log("[OpenAI] Extracted content:\n", content);
  return parseAndValidateAssessment(content, "OpenAI");
};

const groqCall = async (promptText: string) => {
  const apiKey = process.env.GROQ_API_KEY;
  const apiUrl =
    process.env.GROQ_API_URL ||
    process.env.GROQ_BASE_URL ||
    "https://api.groq.com/openai/v1/chat/completions";
  if (!apiKey) {
    throw new AIProviderError("AI_PROVIDER_MISCONFIGURED", "GROQ_API_KEY not set in environment");
  }

  const model = process.env.GROQ_MODEL || "llama-3.1-8b-instant";
  const maxTokens = Number(process.env.GROQ_MAX_TOKENS || "2048");

  console.log("[Groq] Prompt:\n", promptText);
  const res = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content: "Return ONLY valid JSON for the assessment. No markdown.",
        },
        { role: "user", content: promptText },
      ],
      max_tokens: maxTokens,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    if (res.status === 429) {
      const retryAfter = res.headers.get("retry-after");
      const retryMs = retryAfter ? Number(retryAfter) * 1000 : undefined;
      throw new AIProviderError("AI_PROVIDER_RATE_LIMIT", `Groq rate limited: ${body}`, { retryAfterMs: retryMs });
    }
    if (res.status === 401 || res.status === 400) {
      throw new AIProviderError("AI_PROVIDER_MISCONFIGURED", `Groq API error: ${body}`);
    }
    throw new AIProviderError("AI_PROVIDER_ERROR", `Groq API failed: ${body}`);
  }

  let json: any;
  try {
    json = await res.json();
  } catch (e: any) {
    const cause = e?.cause ?? e;
    const isDns = cause && (cause.code === "ENOTFOUND" || String(cause.message).includes("ENOTFOUND"));
    if (isDns) {
      throw new AIProviderError(
        "AI_PROVIDER_MISCONFIGURED",
        `Could not resolve GROQ host for URL ${apiUrl}. Check GROQ_API_URL in your .env and your network/DNS settings.`
      );
    }
    throw new AIProviderError("AI_PROVIDER_ERROR", `Groq fetch failed: ${e?.message || e}`);
  }

  console.log("[Groq] Raw response JSON:\n", JSON.stringify(json, null, 2));
  const content: string | undefined = json?.choices?.[0]?.message?.content;
  console.log("[Groq] Extracted content:\n", content);
  if (!content) {
    throw new AIProviderError("AI_PROVIDER_BAD_OUTPUT", "Groq response missing choices[0].message.content");
  }
  return parseAndValidateAssessment(content, "Groq");
};

export const generateAssessment = async (
  instructions: string,
  sourceMaterial: string,
  questionConfig: QuestionConfig
) => {
  const provider = getProvider();

  const promptText = buildAssessmentPrompt(instructions, sourceMaterial, questionConfig);

  if (provider === "gemini" || provider === "google" || provider === "g") {
    return generateWithGemini(instructions, sourceMaterial, questionConfig);
  }

  if (provider === "openai" || provider === "oa") {
    return openAICall(promptText);
  }

  if (provider === "groq") {
    return groqCall(promptText);
  }

  throw new AIProviderError("AI_PROVIDER_MISCONFIGURED", `Unknown AI provider: ${provider}`);
};

export default { generateAssessment };
