import OpenAI from "openai";
import { env } from "../config/env.js";
import { redisCache } from "../config/redis.js";
import type { CreateAssignmentInput } from "../validators/assignment.validator.js";
import { buildAssessmentPrompt } from "./promptBuilder.js";
import { parseGeneratedPaper } from "./parser.js";
import type { ValidatedGeneratedPaper } from "./validator.js";

const openai = env.OPENAI_API_KEY ? new OpenAI({ apiKey: env.OPENAI_API_KEY }) : null;
const localDifficulties = ["easy", "moderate", "challenging"] as const;

const buildLocalPaper = (assignment: CreateAssignmentInput): ValidatedGeneratedPaper => {
  const sections = assignment.questionTypes.map((questionType, sectionIndex) => ({
    title: `Section ${String.fromCharCode(65 + sectionIndex)}`,
    instruction: `Attempt all ${questionType.label.toLowerCase()}. Each question carries ${questionType.marks} marks.`,
    questions: Array.from({ length: questionType.count }, (_, index) => ({
      text: `[${localDifficulties[index % 3]}] ${questionType.label} ${index + 1}: Explain the key concept and support your answer with a clear example.`,
      difficulty: localDifficulties[index % 3],
      marks: questionType.marks,
      type: questionType.type,
    })),
  }));

  const totalMarks = sections.reduce(
    (sum, section) => sum + section.questions.reduce((inner, question) => inner + question.marks, 0),
    0,
  );

  return {
    title: assignment.title,
    metadata: {
      subject: "General Science",
      classLevel: "5th",
      durationMinutes: 45,
      schoolName: "Delhi Public School, Sector-4, Bokaro",
      dueDate: assignment.dueDate.toISOString().slice(0, 10),
    },
    totalMarks,
    sections,
  };
};

export const generateAssessment = async (
  assignment: CreateAssignmentInput,
  uploadedText?: string,
): Promise<ValidatedGeneratedPaper> => {
  const prompt = buildAssessmentPrompt({ assignment, uploadedText });
  const cacheKey = `assessment:${Buffer.from(prompt).toString("base64url")}`;
  const cached = await redisCache.get(cacheKey);
  if (cached) return parseGeneratedPaper(cached);

  if (!openai) {
    const paper = buildLocalPaper(assignment);
    await redisCache.set(cacheKey, JSON.stringify(paper), "EX", 60 * 60);
    return paper;
  }

  let lastError: unknown;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.35,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: "You return valid JSON only for school assessment generation." },
          { role: "user", content: prompt },
        ],
      });

      const raw = completion.choices[0]?.message.content ?? "";
      const paper = parseGeneratedPaper(raw);
      await redisCache.set(cacheKey, JSON.stringify(paper), "EX", 60 * 60 * 6);
      return paper;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error ? lastError : new Error("AI generation failed");
};
