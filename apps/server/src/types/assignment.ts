export const assignmentStatuses = ["draft", "queued", "generating", "parsing", "completed", "failed"] as const;
export const questionDifficulties = ["easy", "moderate", "challenging"] as const;
export const questionKinds = ["mcq", "short", "diagram", "numerical", "long"] as const;

export type AssignmentStatus = (typeof assignmentStatuses)[number];
export type QuestionDifficulty = (typeof questionDifficulties)[number];
export type QuestionKind = (typeof questionKinds)[number];

export interface QuestionTypeConfig {
  type: QuestionKind;
  label: string;
  count: number;
  marks: number;
}

export interface GeneratedQuestion {
  text: string;
  marks: number;
  difficulty: QuestionDifficulty;
  type: QuestionKind;
}

export interface GeneratedSection {
  title: string;
  instruction: string;
  questions: GeneratedQuestion[];
}

export interface GeneratedPaper {
  title: string;
  metadata: {
    subject: string;
    classLevel: string;
    durationMinutes: number;
    schoolName: string;
    dueDate: string;
  };
  totalMarks: number;
  sections: GeneratedSection[];
}

export interface GenerationProgressPayload {
  assignmentId: string;
  status: AssignmentStatus;
  progress: number;
  message: string;
}
