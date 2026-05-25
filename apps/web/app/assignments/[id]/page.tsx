"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { GenerationProgress } from "@/components/assignment/GenerationProgress";
import { PaperPreview } from "@/components/assignment/PaperPreview";
import { Skeleton } from "@/components/ui/skeleton";
import { useAssignmentSocket } from "@/hooks/useAssignmentSocket";
import { useAssignmentStore } from "@/store/assignmentStore";

export default function AssignmentOutputPage() {
  const params = useParams<{ id: string }>();
  const assignment = useAssignmentStore((state) => state.activeAssignment);
  const progress = useAssignmentStore((state) => state.progress);
  const fetchAssignment = useAssignmentStore((state) => state.fetchAssignment);
  const isLoading = useAssignmentStore((state) => state.isLoading);
  useAssignmentSocket(params.id);

  useEffect(() => {
    void fetchAssignment(params.id);
  }, [fetchAssignment, params.id]);

  useEffect(() => {
    if (progress?.assignmentId === params.id && progress.status === "completed") {
      void fetchAssignment(params.id);
    }
  }, [fetchAssignment, params.id, progress]);

  return (
    <AppShell>
      <div className="space-y-4 px-4 py-5 md:px-0 md:py-0">
        {(assignment?.status !== "completed" || progress?.assignmentId === params.id) && (
          <GenerationProgress progress={progress?.assignmentId === params.id ? progress : undefined} />
        )}

        {isLoading || !assignment ? (
          <div className="space-y-4">
            <Skeleton className="h-28" />
            <Skeleton className="mx-auto h-[760px] max-w-4xl" />
          </div>
        ) : assignment.generatedPaper ? (
          <PaperPreview assignment={assignment} />
        ) : (
          <div className="rounded-[1.35rem] bg-white p-10 text-center shadow-soft">
            <h1 className="text-xl font-extrabold">Preparing your assessment</h1>
            <p className="mt-2 text-sm text-zinc-500">Live generation updates will appear above.</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
