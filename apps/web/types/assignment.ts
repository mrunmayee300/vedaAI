export type AssignmentStatus = "draft" | "queued" | "generating" | "parsing" | "completed" | "failed";
export type QuestionDifficulty = "easy" | "moderate" | "challenging";
export type QuestionKind = "mcq" | "short" | "diagram" | "numerical" | "long";

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

export interface Assignment {
  _id: string;
  title: string;
  dueDate: string;
  instructions: string;
  questionTypes: QuestionTypeConfig[];
  totalQuestions: number;
  marksPerQuestion: number;
  status: AssignmentStatus;
  generatedPaper?: GeneratedPaper;
  failureReason?: string;
  createdAt: string;
  updatedAt: string;
  generationHistory: Array<{
    status: AssignmentStatus;
    progress: number;
    message: string;
    createdAt: string;
  }>;
}

export interface ProgressEvent {
  assignmentId: string;
  status: AssignmentStatus;
  progress: number;
  message: string;
}
