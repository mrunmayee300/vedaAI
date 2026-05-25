import { Queue } from "bullmq";
import { redisConnection } from "../config/redis.js";

export interface GenerationJobData {
  assignmentId: string;
}

export const generationQueue = new Queue<GenerationJobData>("assessment-generation", {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2500,
    },
    removeOnComplete: 100,
    removeOnFail: 200,
  },
});
