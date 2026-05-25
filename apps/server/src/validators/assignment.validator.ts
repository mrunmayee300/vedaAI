import { z } from "zod";
import { questionKinds } from "../types/assignment.js";

export const questionTypeInputSchema = z.object({
  type: z.enum(questionKinds),
  label: z.string().min(2).max(80),
  count: z.coerce.number().int().positive().max(50),
  marks: z.coerce.number().int().positive().max(20),
});

export const createAssignmentSchema = z
  .object({
    title: z.string().min(3).max(120),
    dueDate: z.coerce.date().refine((date) => !Number.isNaN(date.getTime()), "Invalid due date"),
    instructions: z.string().max(3000).optional().default(""),
    questionTypes: z.array(questionTypeInputSchema).min(1),
  })
  .superRefine((value, ctx) => {
    if (value.dueDate < new Date(new Date().toDateString())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["dueDate"],
        message: "Due date cannot be in the past",
      });
    }
  });

export const assignmentIdSchema = z.object({
  id: z.string().min(12),
});

export type CreateAssignmentInput = z.infer<typeof createAssignmentSchema>;
