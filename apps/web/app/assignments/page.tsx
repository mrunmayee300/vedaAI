"use client";

import { useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { AssignmentList } from "@/components/assignment/AssignmentList";
import { Skeleton } from "@/components/ui/skeleton";
import { useAssignmentSocket } from "@/hooks/useAssignmentSocket";
import { useAssignmentStore } from "@/store/assignmentStore";

export default function AssignmentsPage() {
  const assignments = useAssignmentStore((state) => state.assignments);
  const isLoading = useAssignmentStore((state) => state.isLoading);
  const fetchAssignments = useAssignmentStore((state) => state.fetchAssignments);
  useAssignmentSocket();

  useEffect(() => {
    void fetchAssignments();
  }, [fetchAssignments]);

  return (
    <AppShell>
      {isLoading && assignments.length === 0 ? (
        <div className="grid gap-4 p-4 md:grid-cols-2 md:p-0">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-36" />
          ))}
        </div>
      ) : (
        <AssignmentList assignments={assignments} />
      )}
    </AppShell>
  );
}
