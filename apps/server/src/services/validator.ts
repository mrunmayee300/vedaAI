import { z } from "zod";
import { questionDifficulties, questionKinds } from "../types/assignment.js";

export const generatedQuestionSchema = z.object({
  text: z.string().min(8),
  marks: z.number().int().positive().max(20),
  difficulty: z.enum(questionDifficulties),
  type: z.enum(questionKinds),
});

export const generatedSectionSchema = z.object({
  title: z.string().min(3),
  instruction: z.string().min(3),
  questions: z.array(generatedQuestionSchema).min(1),
});

export const generatedPaperSchema = z.object({
  title: z.string().min(3),
  metadata: z.object({
    subject: z.string().min(2),
    classLevel: z.string().min(1),
    durationMinutes: z.number().int().positive().max(240),
    schoolName: z.string().min(2),
    dueDate: z.string().min(8),
  }),
  totalMarks: z.number().int().positive(),
  sections: z.array(generatedSectionSchema).min(1),
});

export type ValidatedGeneratedPaper = z.infer<typeof generatedPaperSchema>;

export const validateGeneratedPaper = (input: unknown): ValidatedGeneratedPaper => {
  const paper = generatedPaperSchema.parse(input);
  const totalMarks = paper.sections.reduce(
    (sum, section) => sum + section.questions.reduce((sectionSum, question) => sectionSum + question.marks, 0),
    0,
  );

  return {
    ...paper,
    totalMarks,
  };
};
