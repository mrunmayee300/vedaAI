import type { Server } from "socket.io";
import type { GenerationProgressPayload } from "../types/assignment.js";

let ioInstance: Server | null = null;

export const registerSocketServer = (io: Server) => {
  ioInstance = io;

  io.on("connection", (socket) => {
    socket.on("assignment:subscribe", (assignmentId: string) => {
      socket.join(`assignment:${assignmentId}`);
    });

    socket.on("assignment:unsubscribe", (assignmentId: string) => {
      socket.leave(`assignment:${assignmentId}`);
    });
  });
};

export const emitAssignmentProgress = (payload: GenerationProgressPayload) => {
  if (!ioInstance) return;
  ioInstance.to(`assignment:${payload.assignmentId}`).emit("assignment:progress", payload);
  ioInstance.emit("assignment:list:changed", payload);
};
