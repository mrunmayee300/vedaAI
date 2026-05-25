import { Router } from "express";
import multer from "multer";
import {
  createAssignmentHandler,
  exportAssignmentPdf,
  getAssignment,
  listAssignments,
  regenerateAssignmentHandler,
} from "../controllers/assignment.controller.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 8 * 1024 * 1024,
  },
});

export const assignmentRouter = Router();

assignmentRouter.get("/", listAssignments);
assignmentRouter.post("/", upload.single("file"), createAssignmentHandler);
assignmentRouter.get("/:id", getAssignment);
assignmentRouter.post("/:id/regenerate", regenerateAssignmentHandler);
assignmentRouter.get("/:id/export", exportAssignmentPdf);
