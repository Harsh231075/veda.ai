import { generateAssessment as generateWithGemini, AIProviderError } from "./aiService";
import { buildAssessmentPrompt, QuestionConfig } from "./assessment";
import { parseAndValidateAssessment, getProvider } from "./utils/aiProviderUtils";


// === Provider handlers ===
const handleGemini = async (
  instructions: string,
  sourceMaterial: string,
  questionConfig: QuestionConfig
) => {
  return generateWithGemini(instructions, sourceMaterial, questionConfig);
};

const handleOpenAI = async (promptText: string) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new AIProviderError("AI_PROVIDER_MISCONFIGURED", "OPENAI_API_KEY not set");

  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const maxTokens = Number(process.env.OPENAI_MAX_TOKENS || "2048");

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model, messages: [{ role: "user", content: promptText }], max_tokens: maxTokens }),
  });

  if (!res.ok) {
    const body = await res.text();
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
  if (!content) throw new AIProviderError("AI_PROVIDER_ERROR", "OpenAI response missing content");

  return parseAndValidateAssessment(content, "OpenAI");
};

const handleGroq = async (promptText: string) => {
  const apiKey = process.env.GROQ_API_KEY;
  const apiUrl = process.env.GROQ_API_URL || process.env.GROQ_BASE_URL || "https://api.groq.com/openai/v1/chat/completions";
  if (!apiKey) throw new AIProviderError("AI_PROVIDER_MISCONFIGURED", "GROQ_API_KEY not set");

  const model = process.env.GROQ_MODEL || "llama-3.1-8b-instant";
  const maxTokens = Number(process.env.GROQ_MAX_TOKENS || "2048");

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model, messages: [{ role: "system", content: "Return ONLY valid JSON for the assessment. No markdown." }, { role: "user", content: promptText }], max_tokens: maxTokens }),
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
      throw new AIProviderError("AI_PROVIDER_MISCONFIGURED", `Could not resolve GROQ host for URL ${apiUrl}.`);
    }
    throw new AIProviderError("AI_PROVIDER_ERROR", `Groq fetch failed: ${e?.message || e}`);
  }

  const content: string | undefined = json?.choices?.[0]?.message?.content;
  if (!content) throw new AIProviderError("AI_PROVIDER_BAD_OUTPUT", "Groq response missing content");

  return parseAndValidateAssessment(content, "Groq");
};

// === Public dispatcher ===
export const generateAssessment = async (
  instructions: string,
  sourceMaterial: string,
  questionConfig: QuestionConfig
) => {
  const provider = getProvider();
  const promptText = buildAssessmentPrompt(instructions, sourceMaterial, questionConfig);

  switch (provider) {
    case "gemini":
    case "google":
    case "g":
      return handleGemini(instructions, sourceMaterial, questionConfig);
    case "openai":
    case "oa":
      return handleOpenAI(promptText);
    case "groq":
      return handleGroq(promptText);
    default:
      throw new AIProviderError("AI_PROVIDER_MISCONFIGURED", `Unknown AI provider: ${provider}`);
  }
};

export default { generateAssessment };
