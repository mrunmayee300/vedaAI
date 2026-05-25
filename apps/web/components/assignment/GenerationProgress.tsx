"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import type { AssignmentStatus, ProgressEvent } from "@/types/assignment";
import { cn } from "@/lib/utils";

const steps: AssignmentStatus[] = ["queued", "generating", "parsing", "completed"];

export const GenerationProgress = ({ progress }: { progress?: ProgressEvent }) => {
  const activeStatus = progress?.status ?? "queued";
  const currentIndex = Math.max(steps.indexOf(activeStatus), 0);

  return (
    <div className="rounded-[1.35rem] bg-zinc-950 p-5 text-white shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold">AI generation status</p>
          <p className="mt-1 text-sm text-zinc-300">{progress?.message ?? "Waiting for updates..."}</p>
        </div>
        {activeStatus === "failed" ? (
          <XCircle className="h-5 w-5 text-red-400" />
        ) : activeStatus === "completed" ? (
          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
        ) : (
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        )}
      </div>

      <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className={cn("h-full rounded-full", activeStatus === "failed" ? "bg-red-400" : "bg-primary")}
          initial={{ width: 0 }}
          animate={{ width: `${progress?.progress ?? 5}%` }}
        />
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
        {steps.map((step, index) => (
          <span key={step} className={cn(index <= currentIndex && "text-white")}>
            {step}
          </span>
        ))}
      </div>
    </div>
  );
};
