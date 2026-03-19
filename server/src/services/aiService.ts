import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import Bottleneck from "bottleneck";
import { AssessmentSchema, buildAssessmentPrompt, QuestionConfig } from "./assessment";

type GeminiErrorLike = { status?: number; message?: string; errorDetails?: Array<any> };

export class AIProviderError extends Error {
  public readonly code:
    | "AI_PROVIDER_MISCONFIGURED"
    | "AI_PROVIDER_QUOTA_ZERO"
    | "AI_PROVIDER_RATE_LIMIT"
    | "AI_PROVIDER_BAD_OUTPUT"
    | "AI_PROVIDER_ERROR";
  public readonly retryAfterMs?: number;

  constructor(code: AIProviderError["code"], message: string, options?: { retryAfterMs?: number }) {
    super(message);
    this.name = "AIProviderError";
    this.code = code;
    this.retryAfterMs = options?.retryAfterMs;
  }
}

export const isAIProviderError = (err: any): err is AIProviderError => Boolean(err && err.name === "AIProviderError");

// --- Helpers ---
const parseRetryAfterMs = (error: GeminiErrorLike): number | undefined => {
  const retryInfo = error?.errorDetails?.find((d) => String(d?.["@type"] ?? "").includes("RetryInfo"));
  const raw = retryInfo?.retryDelay ?? "";
  const s = String(raw).trim();
  const sec = s.match(/^([0-9]+)s$/i)?.[1];
  if (sec) return Number(sec) * 1000;
  const ms = s.match(/^([0-9]+)ms$/i)?.[1];
  return ms ? Number(ms) : undefined;
};

const isQuotaZeroError = (error: GeminiErrorLike): boolean => {
  const msg = String(error?.message ?? "").toLowerCase();
  if (msg.includes("limit: 0") && msg.includes("quota")) return true;
  if (msg.includes("free_tier") && msg.includes("quota")) return true;
  const quotaFailure = error?.errorDetails?.find((d) => String(d?.["@type"] ?? "").includes("QuotaFailure"));
  const violations: Array<any> = quotaFailure?.violations ?? [];
  return violations.some((v) => String(v?.quotaId ?? "").toLowerCase().includes("freetier"));
};

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash";
const GEMINI_MAX_TOKENS = Number(process.env.GEMINI_MAX_OUTPUT_TOKENS || "2048");

const RPM = Math.max(1, Number(process.env.GEMINI_RPM || "20"));
const MAX_CONC = Math.max(1, Number(process.env.GEMINI_MAX_CONCURRENCY || "1"));
const geminiLimiter = new Bottleneck({
  reservoir: RPM,
  reservoirRefreshAmount: RPM,
  reservoirRefreshInterval: 60 * 1000,
  maxConcurrent: MAX_CONC,
});

export const generateAssessment = async (instructions: string, sourceMaterial: string, questionConfig: QuestionConfig) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new AIProviderError("AI_PROVIDER_MISCONFIGURED", "GEMINI_API_KEY not set");

  const model = new ChatGoogleGenerativeAI({ model: GEMINI_MODEL, maxOutputTokens: GEMINI_MAX_TOKENS, apiKey });
  const structured = model.withStructuredOutput(AssessmentSchema);
  const promptText = buildAssessmentPrompt(instructions, sourceMaterial, questionConfig);

  try {
    const resp = await geminiLimiter.schedule(() => structured.invoke(promptText));
    return resp;
  } catch (err: any) {
    const cause = (err?.cause as GeminiErrorLike) ?? (err as GeminiErrorLike);
    const status = Number(cause?.status);
    const retryAfterMs = parseRetryAfterMs(cause);

    if (status === 429) {
      if (isQuotaZeroError(cause)) {
        throw new AIProviderError(
          "AI_PROVIDER_QUOTA_ZERO",
          `Gemini quota is effectively 0 for model "${GEMINI_MODEL}". Enable billing or choose another model.`,
          { retryAfterMs }
        );
      }
      throw new AIProviderError("AI_PROVIDER_RATE_LIMIT", `Gemini rate-limited (429).`, { retryAfterMs });
    }

    throw new AIProviderError("AI_PROVIDER_ERROR", cause?.message || "Gemini request failed", { retryAfterMs });
  }
};


