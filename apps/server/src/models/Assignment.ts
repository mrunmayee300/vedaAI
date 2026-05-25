import { model, Schema, type InferSchemaType } from "mongoose";
import { assignmentStatuses, questionDifficulties, questionKinds } from "../types/assignment.js";

const questionTypeSchema = new Schema(
  {
    type: { type: String, enum: questionKinds, required: true },
    label: { type: String, required: true },
    count: { type: Number, min: 1, required: true },
    marks: { type: Number, min: 1, required: true },
  },
  { _id: false },
);

const uploadedContentSchema = new Schema(
  {
    fileName: String,
    mimeType: String,
    text: String,
  },
  { _id: false },
);

const questionSchema = new Schema(
  {
    text: { type: String, required: true },
    marks: { type: Number, min: 1, required: true },
    difficulty: { type: String, enum: questionDifficulties, required: true },
    type: { type: String, enum: questionKinds, required: true },
  },
  { _id: false },
);

const sectionSchema = new Schema(
  {
    title: { type: String, required: true },
    instruction: { type: String, required: true },
    questions: { type: [questionSchema], default: [] },
  },
  { _id: false },
);

const generatedPaperSchema = new Schema(
  {
    title: { type: String, required: true },
    metadata: {
      subject: { type: String, default: "General Science" },
      classLevel: { type: String, default: "5th" },
      durationMinutes: { type: Number, default: 45 },
      schoolName: { type: String, default: "Delhi Public School, Sector-4, Bokaro" },
      dueDate: { type: String, required: true },
    },
    totalMarks: { type: Number, required: true },
    sections: { type: [sectionSchema], default: [] },
  },
  { _id: false },
);

const generationHistorySchema = new Schema(
  {
    status: { type: String, enum: assignmentStatuses, required: true },
    message: { type: String, required: true },
    progress: { type: Number, min: 0, max: 100, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const assignmentSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    dueDate: { type: Date, required: true },
    instructions: { type: String, default: "" },
    questionTypes: { type: [questionTypeSchema], required: true },
    totalQuestions: { type: Number, min: 1, required: true },
    marksPerQuestion: { type: Number, min: 1, required: true },
    uploadedContent: uploadedContentSchema,
    status: { type: String, enum: assignmentStatuses, default: "draft", index: true },
    generatedPaper: generatedPaperSchema,
    generationHistory: { type: [generationHistorySchema], default: [] },
    failureReason: String,
  },
  { timestamps: true },
);

assignmentSchema.index({ createdAt: -1 });

export type AssignmentDocument = InferSchemaType<typeof assignmentSchema> & { _id: string };

export const AssignmentModel = model("Assignment", assignmentSchema);
