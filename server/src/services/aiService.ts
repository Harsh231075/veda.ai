import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";

type GeminiErrorLike = {
  status?: number;
  message?: string;
  errorDetails?: Array<any>;
};

export class AIProviderError extends Error {
  public readonly code:
    | "AI_PROVIDER_MISCONFIGURED"
    | "AI_PROVIDER_QUOTA_ZERO"
    | "AI_PROVIDER_RATE_LIMIT"
    | "AI_PROVIDER_ERROR";
  public readonly retryAfterMs?: number;

  constructor(
    code: AIProviderError["code"],
    message: string,
    options?: { retryAfterMs?: number }
  ) {
    super(message);
    this.name = "AIProviderError";
    this.code = code;
    this.retryAfterMs = options?.retryAfterMs;
  }
}

export const isAIProviderError = (err: any): err is AIProviderError => {
  return Boolean(err && err.name === "AIProviderError" && typeof err.code === "string");
};

const parseRetryAfterMs = (error: GeminiErrorLike): number | undefined => {
  // Gemini SDK surfaces google.rpc.RetryInfo in errorDetails with retryDelay like "40s".
  const retryInfo = error?.errorDetails?.find((d) => d?.["@type"]?.includes("RetryInfo"));
  const retryDelay: string | undefined = retryInfo?.retryDelay;
  if (!retryDelay) return undefined;

  const trimmed = String(retryDelay).trim();
  const secondsMatch = trimmed.match(/^([0-9]+)s$/i);
  if (secondsMatch) return Number(secondsMatch[1]) * 1000;

  const msMatch = trimmed.match(/^([0-9]+)ms$/i);
  if (msMatch) return Number(msMatch[1]);

  return undefined;
};

const isQuotaZeroError = (error: GeminiErrorLike): boolean => {
  const msg = String(error?.message ?? "");
  if (msg.includes("limit: 0") && msg.toLowerCase().includes("quota")) return true;
  if (msg.toLowerCase().includes("free_tier") && msg.toLowerCase().includes("quota")) return true;

  const quotaFailure = error?.errorDetails?.find((d) => d?.["@type"]?.includes("QuotaFailure"));
  const violations: Array<any> = quotaFailure?.violations ?? [];
  return violations.some((v) => String(v?.quotaId ?? "").toLowerCase().includes("freetier"));
};

const getGeminiModelName = (): string => {
  // Prefer an env override so prod can change model without code changes.
  // Default to a commonly-available "flash" model rather than hard-coding 2.0.
  return process.env.GEMINI_MODEL || "gemini-1.5-flash";
};

const getGeminiMaxOutputTokens = (): number => {
  const raw = process.env.GEMINI_MAX_OUTPUT_TOKENS;
  const parsed = raw ? Number(raw) : NaN;
  // 8192 output tokens is expensive and can trip rate limits quickly.
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 2048;
};

const AssessmentSchema = z.object({
  sections: z.array(z.object({
    title: z.string().describe("E.g., Section A: Multiple Choice Questions"),
    instructions: z.string().describe("E.g., Attempt all questions. Each carries 1 mark."),
    questions: z.array(z.object({
      questionText: z.string(),
      difficulty: z.enum(["Easy", "Moderate", "Hard"]),
      marks: z.number(),
      options: z.array(z.string()).optional().describe("Only provide if it is an MCQ"),
      expectedAnswer: z.string().optional()
    }))
  }))
});

export const generateAssessment = async (
  instructions: string,
  sourceMaterial: string,
  questionConfig: { type: string, count: number, marks: number }[]
) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new AIProviderError(
      "AI_PROVIDER_MISCONFIGURED",
      "GEMINI_API_KEY is not set. Add it to server env (.env) as GEMINI_API_KEY=..."
    );
  }

  const model = new ChatGoogleGenerativeAI({
    model: getGeminiModelName(),
    maxOutputTokens: getGeminiMaxOutputTokens(),
    apiKey: process.env.GEMINI_API_KEY
  });

  const structuredLlm = model.withStructuredOutput(AssessmentSchema);

  const promptText = `
You are an expert AI Assessment Creator for VedaAI.
Generate a structured question paper based on the following configurations.

---
Source Material / Context:
${sourceMaterial || "Use general knowledge appropriate for the requested topics/instructions"}

---
Instructions from user:
${instructions || "No specific instructions"}

---
Required Questions Configuration:
${JSON.stringify(questionConfig, null, 2)}

Ensure you STRICTLY follow the question configuration (counts, marks, types).
Do NOT include options if the question type is NOT multiple choice.
`;

  try {
    const response = await structuredLlm.invoke(promptText);
    return response;
  } catch (err: any) {
    const error = ((err?.cause as GeminiErrorLike) ?? (err as GeminiErrorLike));
    const status = Number(error?.status);
    const retryAfterMs = parseRetryAfterMs(error);

    if (status === 429) {
      if (isQuotaZeroError(error)) {
        throw new AIProviderError(
          "AI_PROVIDER_QUOTA_ZERO",
          `Gemini quota is effectively 0 for model "${getGeminiModelName()}" (free-tier quota/billing not enabled). ` +
          `Fix: enable billing/paid plan in Google AI Studio, or set GEMINI_MODEL to a model that has quota for your project.`,
          { retryAfterMs }
        );
      }

      throw new AIProviderError(
        "AI_PROVIDER_RATE_LIMIT",
        `Gemini rate-limited the request (429).` +
        (retryAfterMs ? ` Retry after ~${Math.ceil(retryAfterMs / 1000)}s.` : ""),
        { retryAfterMs }
      );
    }

    throw new AIProviderError(
      "AI_PROVIDER_ERROR",
      error?.message || "Gemini request failed",
      { retryAfterMs }
    );
  }
};

