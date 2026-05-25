import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse") as (buffer: Buffer) => Promise<{ text: string }>;

export const extractUploadedText = async (file?: Express.Multer.File) => {
  if (!file) return undefined;

  if (file.mimetype === "application/pdf") {
    const parsed = await pdfParse(file.buffer);
    return parsed.text.slice(0, 16000);
  }

  if (file.mimetype.startsWith("text/")) {
    return file.buffer.toString("utf8").slice(0, 16000);
  }

  return `Uploaded file: ${file.originalname}. Binary content was accepted but not text-extractable.`;
};
