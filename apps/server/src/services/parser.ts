import { AppError } from "../utils/AppError.js";
import { validateGeneratedPaper, type ValidatedGeneratedPaper } from "./validator.js";

const extractJson = (raw: string) => {
  const trimmed = raw.trim();
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) return trimmed;

  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new AppError("AI response did not contain JSON", 502);
  }

  return trimmed.slice(start, end + 1);
};

export const parseGeneratedPaper = (raw: string): ValidatedGeneratedPaper => {
  try {
    const parsed: unknown = JSON.parse(extractJson(raw));
    return validateGeneratedPaper(parsed);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError("AI response failed schema validation", 502);
  }
};
