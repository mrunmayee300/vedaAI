import { AssignmentModel } from "../models/Assignment.js";
import { createAssignment, regenerateAssignment } from "../services/assignment.service.js";
import { createAssessmentPdf } from "../services/pdf.service.js";
import { extractUploadedText } from "../services/upload.service.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { assignmentIdSchema, createAssignmentSchema } from "../validators/assignment.validator.js";

const parseQuestionTypes = (value: unknown) => {
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value) as unknown;
  } catch {
    throw new AppError("Question types must be valid JSON", 422);
  }
};

export const listAssignments = asyncHandler(async (_req, res) => {
  const assignments = await AssignmentModel.find().sort({ createdAt: -1 }).lean();
  return sendSuccess(res, 200, "Assignments fetched", { assignments });
});

export const getAssignment = asyncHandler(async (req, res) => {
  const { id } = assignmentIdSchema.parse(req.params);
  const assignment = await AssignmentModel.findById(id).lean();
  if (!assignment) throw new AppError("Assignment not found", 404);
  return sendSuccess(res, 200, "Assignment fetched", { assignment });
});

export const createAssignmentHandler = asyncHandler(async (req, res) => {
  const uploadedText = await extractUploadedText(req.file);
  const input = createAssignmentSchema.parse({
    ...req.body,
    questionTypes: parseQuestionTypes(req.body.questionTypes),
  });

  const assignment = await createAssignment({
    input,
    uploadedContent: req.file
      ? {
          fileName: req.file.originalname,
          mimeType: req.file.mimetype,
          text: uploadedText ?? "",
        }
      : undefined,
  });

  return sendSuccess(res, 201, "Assignment created", { assignment });
});

export const regenerateAssignmentHandler = asyncHandler(async (req, res) => {
  const { id } = assignmentIdSchema.parse(req.params);
  const assignment = await regenerateAssignment(id);
  if (!assignment) throw new AppError("Assignment not found", 404);
  return sendSuccess(res, 202, "Regeneration queued", { assignment });
});

export const exportAssignmentPdf = asyncHandler(async (req, res) => {
  const { id } = assignmentIdSchema.parse(req.params);
  const assignment = await AssignmentModel.findById(id).lean();
  if (!assignment?.generatedPaper) throw new AppError("Generated paper is not ready", 409);

  const buffer = await createAssessmentPdf(assignment.generatedPaper);
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${assignment.title.replace(/\W+/g, "-")}.pdf"`);
  return res.send(buffer);
});
