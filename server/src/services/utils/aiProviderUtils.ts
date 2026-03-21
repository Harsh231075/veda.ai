import { normalizeAssessment, Assessment } from "../assessment";
import { AIProviderError } from "../aiService";

export const extractFencedJson = (text: string): string => {
  const trimmed = text?.trim?.() ?? "";
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenced) return fenced[1];

  const startIdx = trimmed.indexOf("{");
  const endIdx = trimmed.lastIndexOf("}");
  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    return trimmed.substring(startIdx, endIdx + 1);
  }

  return trimmed;
};

export const safeJsonParse = (text: string): unknown => {
  const toParse = extractFencedJson(text);
  return JSON.parse(toParse);
};

export const parseAndValidateAssessment = (rawContent: string, providerName: string): Assessment => {
  let parsed: unknown;
  try {
    parsed = safeJsonParse(rawContent);
  } catch (err: any) {
    throw new AIProviderError(
      "AI_PROVIDER_BAD_OUTPUT",
      `${providerName} returned invalid JSON. Ensure the model is instructed to return JSON only.`
    );
  }

  try {
    return normalizeAssessment(parsed);
  } catch (err) {
    const preview = String(rawContent ?? "").slice(0, 800);
    throw new AIProviderError(
      "AI_PROVIDER_BAD_OUTPUT",
      `${providerName} returned JSON that does not match the expected schema. Preview: ${preview}`
    );
  }
};

export const getProvider = (): string => (process.env.AI_PROVIDER || process.env.GEMINI_PROVIDER || "gemini").toLowerCase();

export default { extractFencedJson, safeJsonParse, parseAndValidateAssessment, getProvider };
