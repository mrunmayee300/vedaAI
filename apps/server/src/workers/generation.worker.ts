import { Worker } from "bullmq";
import { redisConnection } from "../config/redis.js";
import { AssignmentModel } from "../models/Assignment.js";
import type { AssignmentStatus } from "../types/assignment.js";
import { generateAssessment } from "../services/ai.service.js";
import { emitAssignmentProgress } from "../sockets/socket.js";
import { AppError } from "../utils/AppError.js";
import type { GenerationJobData } from "../queues/generation.queue.js";

const pushProgress = async (
  assignmentId: string,
  status: AssignmentStatus,
  progress: number,
  message: string,
) => {
  await AssignmentModel.findByIdAndUpdate(assignmentId, {
    status,
    $push: { generationHistory: { status, progress, message } },
  });
  emitAssignmentProgress({ assignmentId, status, progress, message });
};

export const createGenerationWorker = () => {
  const worker = new Worker<GenerationJobData>(
    "assessment-generation",
    async (job) => {
      const { assignmentId } = job.data;
      const assignment = await AssignmentModel.findById(assignmentId).lean();
      if (!assignment) throw new AppError("Assignment not found", 404);

      await pushProgress(assignmentId, "generating", 25, "Analyzing assignment requirements");
      await job.updateProgress(25);

      const generationInput = {
        title: assignment.title,
        dueDate: assignment.dueDate,
        instructions: assignment.instructions ?? "",
        questionTypes: assignment.questionTypes,
      };

      await pushProgress(assignmentId, "generating", 55, "Generating assessment with AI");
      await job.updateProgress(55);

      const generatedPaper = await generateAssessment(generationInput, assignment.uploadedContent?.text ?? undefined);

      await pushProgress(assignmentId, "parsing", 78, "Validating structured JSON output");
      await job.updateProgress(78);

      await AssignmentModel.findByIdAndUpdate(assignmentId, {
        status: "completed",
        generatedPaper,
        failureReason: undefined,
        $push: {
          generationHistory: {
            status: "completed",
            progress: 100,
            message: "Assessment is ready",
          },
        },
      });

      await job.updateProgress(100);
      emitAssignmentProgress({
        assignmentId,
        status: "completed",
        progress: 100,
        message: "Assessment is ready",
      });
    },
    { connection: redisConnection, concurrency: 4 },
  );

  worker.on("failed", async (job, error) => {
    const assignmentId = job?.data.assignmentId;
    if (!assignmentId) return;

    await AssignmentModel.findByIdAndUpdate(assignmentId, {
      status: "failed",
      failureReason: error.message,
      $push: {
        generationHistory: {
          status: "failed",
          progress: 100,
          message: error.message || "Generation failed",
        },
      },
    });

    emitAssignmentProgress({
      assignmentId,
      status: "failed",
      progress: 100,
      message: error.message || "Generation failed",
    });
  });

  return worker;
};
