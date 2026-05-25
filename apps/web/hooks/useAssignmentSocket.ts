"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";
import { useAssignmentStore } from "@/store/assignmentStore";
import type { ProgressEvent } from "@/types/assignment";

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:4000", {
  autoConnect: false,
  transports: ["websocket"],
});

export const useAssignmentSocket = (assignmentId?: string) => {
  const applyProgress = useAssignmentStore((state) => state.applyProgress);

  useEffect(() => {
    if (!socket.connected) socket.connect();

    const handleProgress = (payload: ProgressEvent) => {
      applyProgress(payload);
    };

    socket.on("assignment:progress", handleProgress);
    socket.on("assignment:list:changed", handleProgress);

    if (assignmentId) socket.emit("assignment:subscribe", assignmentId);

    return () => {
      if (assignmentId) socket.emit("assignment:unsubscribe", assignmentId);
      socket.off("assignment:progress", handleProgress);
      socket.off("assignment:list:changed", handleProgress);
    };
  }, [assignmentId, applyProgress]);

  return socket;
};
