import { AssignmentModel } from "../models/Assignment.js";
import { generationQueue } from "../queues/generation.queue.js";
import { emitAssignmentProgress } from "../sockets/socket.js";
import type { CreateAssignmentInput } from "../validators/assignment.validator.js";

interface CreateAssignmentPayload {
  input: CreateAssignmentInput;
  uploadedContent?: {
    fileName: string;
    mimeType: string;
    text: string;
  };
}

export const createAssignment = async ({ input, uploadedContent }: CreateAssignmentPayload) => {
  const totalQuestions = input.questionTypes.reduce((sum, item) => sum + item.count, 0);
  const totalMarks = input.questionTypes.reduce((sum, item) => sum + item.count * item.marks, 0);
  const marksPerQuestion = Math.round(totalMarks / totalQuestions);

  const assignment = await AssignmentModel.create({
    ...input,
    uploadedContent,
    totalQuestions,
    marksPerQuestion,
    status: "queued",
    generationHistory: [{ status: "queued", progress: 5, message: "Generation queued" }],
  });

  await generationQueue.add("generate-assessment", { assignmentId: assignment._id.toString() });

  emitAssignmentProgress({
    assignmentId: assignment._id.toString(),
    status: "queued",
    progress: 5,
    message: "Generation queued",
  });

  return assignment;
};

export const regenerateAssignment = async (assignmentId: string) => {
  const assignment = await AssignmentModel.findByIdAndUpdate(
    assignmentId,
    {
      status: "queued",
      failureReason: undefined,
      $push: {
        generationHistory: {
          status: "queued",
          progress: 5,
          message: "Regeneration queued",
        },
      },
    },
    { new: true },
  );

  if (!assignment) return null;
  await generationQueue.add("regenerate-assessment", { assignmentId });
  emitAssignmentProgress({ assignmentId, status: "queued", progress: 5, message: "Regeneration queued" });
  return assignment;
};
