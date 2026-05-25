import type { QuestionTypeConfig } from "@/types/assignment";

export const defaultQuestionTypes: QuestionTypeConfig[] = [
  { type: "mcq", label: "Multiple Choice Questions", count: 4, marks: 4 },
  { type: "short", label: "Short Questions", count: 3, marks: 2 },
  { type: "diagram", label: "Diagram/Graph-Based Questions", count: 5, marks: 5 },
  { type: "numerical", label: "Numerical Problems", count: 5, marks: 5 },
];

export const questionTypeOptions = [
  { value: "mcq", label: "Multiple Choice Questions" },
  { value: "short", label: "Short Questions" },
  { value: "diagram", label: "Diagram/Graph-Based Questions" },
  { value: "numerical", label: "Numerical Problems" },
  { value: "long", label: "Long Answer Questions" },
] as const;
