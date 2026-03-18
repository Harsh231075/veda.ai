import { z } from "zod";

export type QuestionConfig = { type: string; count: number; marks: number }[];

export const AssessmentSchema = z.object({
  sections: z.array(
    z.object({
      title: z.string().describe("E.g., Section A: Multiple Choice Questions"),
      instructions: z
        .string()
        .describe("E.g., Attempt all questions. Each carries 1 mark."),
      questions: z.array(
        z.object({
          questionText: z.string(),
          difficulty: z.enum(["Easy", "Moderate", "Hard"]),
          marks: z.number(),
          options: z
            .array(z.string())
            .optional()
            .describe("Only provide if it is an MCQ"),
          expectedAnswer: z.string().optional(),
        })
      ),
    })
  ),
});

export type Assessment = z.infer<typeof AssessmentSchema>;

const ASSESSMENT_SCHEMA_TEXT = `{
  "sections": [
    {
      "title": "string",
      "instructions": "string",
      "questions": [
        {
          "questionText": "string",
          "difficulty": "Easy | Moderate | Hard",
          "marks": 1,
          "options": ["string"],
          "expectedAnswer": "string"
        }
      ]
    }
  ]
}`;

type LegacyQuestion = {
  type?: string;
  question?: string;
  questionText?: string;
  options?: string[];
  answer?: string;
  expectedAnswer?: string;
  marks?: number;
  difficulty?: "Easy" | "Moderate" | "Hard";
};

export const normalizeAssessment = (input: unknown): Assessment => {
  const direct = AssessmentSchema.safeParse(input);
  if (direct.success) return direct.data;

  // Common fallback: some models return a top-level array of questions.
  if (Array.isArray(input)) {
    const questions = input as LegacyQuestion[];
    const byType = new Map<string, LegacyQuestion[]>();

    for (const q of questions) {
      const type = (q?.type || "Questions").trim();
      const list = byType.get(type) || [];
      list.push(q);
      byType.set(type, list);
    }

    const sections = Array.from(byType.entries()).map(([type, qs]) => {
      return {
        title: type,
        instructions: "Attempt all questions.",
        questions: qs.map((q) => ({
          questionText: q.questionText || q.question || "",
          difficulty: q.difficulty || "Moderate",
          marks: typeof q.marks === "number" ? q.marks : 1,
          options: Array.isArray(q.options) && q.options.length > 0 ? q.options : undefined,
          expectedAnswer: q.expectedAnswer || q.answer,
        })),
      };
    });

    const converted = { sections };
    const convertedParsed = AssessmentSchema.safeParse(converted);
    if (convertedParsed.success) return convertedParsed.data;
  }

  // If we reach here, it's invalid.
  throw new Error("ASSESSMENT_SCHEMA_MISMATCH");
};

export const buildAssessmentPrompt = (
  instructions: string,
  sourceMaterial: string,
  questionConfig: QuestionConfig
): string => {
  return `
You are an expert AI Assessment Creator for VedaAI.
Return ONLY valid JSON that matches this schema:
${ASSESSMENT_SCHEMA_TEXT}

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

Rules:
- STRICTLY follow the question configuration (counts, marks, types)
- Do NOT include options if the question type is NOT multiple choice
- Output JSON only. No markdown, no extra text.
`;
};
