import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(4000),
  MONGODB_URI: z.string().min(1).default("mongodb://localhost:27017/veda-ai"),
  REDIS_URL: z.string().min(1).default("redis://localhost:6379"),
  OPENAI_API_KEY: z.string().optional(),
  CLIENT_URL: z.string().url().default("http://localhost:3000"),
});

export const env = envSchema.parse(process.env);
