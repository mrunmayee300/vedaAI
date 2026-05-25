"use client";

import { create } from "zustand";
import type { Assignment, ProgressEvent } from "@/types/assignment";
import { assignmentApi } from "@/services/api";

interface AssignmentState {
  assignments: Assignment[];
  activeAssignment?: Assignment;
  isLoading: boolean;
  progress?: ProgressEvent;
  fetchAssignments: () => Promise<void>;
  fetchAssignment: (id: string) => Promise<Assignment>;
  upsertAssignment: (assignment: Assignment) => void;
  applyProgress: (progress: ProgressEvent) => void;
}

export const useAssignmentStore = create<AssignmentState>((set, get) => ({
  assignments: [],
  isLoading: false,
  async fetchAssignments() {
    set({ isLoading: true });
    try {
      const assignments = await assignmentApi.list();
      set({ assignments });
    } finally {
      set({ isLoading: false });
    }
  },
  async fetchAssignment(id) {
    set({ isLoading: true });
    try {
      const assignment = await assignmentApi.get(id);
      set({ activeAssignment: assignment });
      get().upsertAssignment(assignment);
      return assignment;
    } finally {
      set({ isLoading: false });
    }
  },
  upsertAssignment(assignment) {
    set((state) => ({
      assignments: [assignment, ...state.assignments.filter((item) => item._id !== assignment._id)],
      activeAssignment: state.activeAssignment?._id === assignment._id ? assignment : state.activeAssignment,
    }));
  },
  applyProgress(progress) {
    set((state) => ({
      progress,
      assignments: state.assignments.map((assignment) =>
        assignment._id === progress.assignmentId
          ? { ...assignment, status: progress.status }
          : assignment,
      ),
      activeAssignment:
        state.activeAssignment?._id === progress.assignmentId
          ? { ...state.activeAssignment, status: progress.status }
          : state.activeAssignment,
    }));
  },
}));
