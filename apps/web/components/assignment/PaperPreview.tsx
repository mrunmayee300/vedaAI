"use client";

import { Download, RotateCcw } from "lucide-react";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { assignmentApi } from "@/services/api";
import type { Assignment, GeneratedPaper } from "@/types/assignment";

const difficultyColor = {
  easy: "bg-emerald-50 text-emerald-700",
  moderate: "bg-amber-50 text-amber-700",
  challenging: "bg-rose-50 text-rose-700",
};

export const PaperPreview = ({ assignment }: { assignment: Assignment }) => {
  const paper = assignment.generatedPaper as GeneratedPaper | undefined;

  if (!paper) return null;

  const regenerate = async () => {
    await toast.promise(assignmentApi.regenerate(assignment._id), {
      loading: "Regenerating...",
      success: "Regeneration queued",
      error: "Could not regenerate",
    });
  };

  return (
    <div className="space-y-4">
      <div className="sticky top-20 z-20 rounded-[1.35rem] bg-zinc-950 p-4 text-white shadow-soft md:top-0">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold">Certainly, Lakshya! Here are customized questions for your class.</p>
            <p className="text-xs text-zinc-400">Structured, validated JSON rendered into a printable exam paper.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-white/15 bg-white text-zinc-950" onClick={regenerate}>
              <RotateCcw className="h-4 w-4" />
              Regenerate
            </Button>
            <Button asChild size="sm" className="bg-white text-zinc-950 hover:bg-zinc-100">
              <a href={assignmentApi.exportUrl(assignment._id)}>
                <Download className="h-4 w-4" />
                Download as PDF
              </a>
            </Button>
          </div>
        </div>
      </div>

      <article className="paper-shadow mx-auto max-w-4xl bg-white px-6 py-8 md:px-14 md:py-12">
        <header className="text-center">
          <h1 className="text-2xl font-extrabold">{paper.metadata.schoolName}</h1>
          <p className="mt-2 font-bold">Subject: {paper.metadata.subject}</p>
          <p className="text-sm">Class: {paper.metadata.classLevel}</p>
        </header>

        <div className="mt-8 flex justify-between text-sm">
          <p>Time Allowed: {paper.metadata.durationMinutes} minutes</p>
          <p>Maximum Marks: {paper.totalMarks}</p>
        </div>

        <div className="mt-7 space-y-2 text-sm">
          <p className="font-semibold">All questions are compulsory unless stated otherwise.</p>
          <p>Name: ____________________________</p>
          <p>Roll Number: ______________________</p>
          <p>Class: 5th Section: ________________</p>
        </div>

        <div className="mt-10 space-y-10">
          {paper.sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-center text-lg font-extrabold">{section.title}</h2>
              <p className="mt-4 text-sm font-semibold">{section.instruction}</p>
              <div className="mt-5 space-y-4">
                {section.questions.map((question, index) => (
                  <div key={`${section.title}-${index}`} className="grid grid-cols-[1fr_auto] gap-4 text-sm leading-6">
                    <div>
                      <p>
                        {index + 1}. {question.text}
                      </p>
                      <Badge className={difficultyColor[question.difficulty]}>{question.difficulty}</Badge>
                    </div>
                    <span className="font-semibold">[{question.marks} Marks]</span>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </article>
    </div>
  );
};
