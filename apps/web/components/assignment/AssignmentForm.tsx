"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Mic, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileDropzone } from "./FileDropzone";
import { assignmentApi } from "@/services/api";
import { defaultQuestionTypes, questionTypeOptions } from "@/lib/constants";

const schema = z.object({
  title: z.string().min(3, "Title is required"),
  dueDate: z.string().min(1, "Due date is required"),
  instructions: z.string().max(3000).optional(),
  questionTypes: z.array(
    z.object({
      type: z.enum(["mcq", "short", "diagram", "numerical", "long"]),
      label: z.string().min(2),
      count: z.coerce.number().int().positive(),
      marks: z.coerce.number().int().positive(),
    }),
  ).min(1),
});

type FormValues = z.infer<typeof schema>;

export const AssignmentForm = () => {
  const router = useRouter();
  const [file, setFile] = useState<File | undefined>();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "Quiz on Electricity",
      dueDate: "",
      instructions: "Generate a question paper for 3-hour exam duration.",
      questionTypes: defaultQuestionTypes,
    },
  });
  const { fields, append, remove } = useFieldArray({ control: form.control, name: "questionTypes" });
  const questionTypes = form.watch("questionTypes");
  const totalQuestions = questionTypes.reduce((sum, item) => sum + Number(item.count || 0), 0);
  const totalMarks = questionTypes.reduce((sum, item) => sum + Number(item.count || 0) * Number(item.marks || 0), 0);

  const onSubmit = async (values: FormValues) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("dueDate", values.dueDate);
    formData.append("instructions", values.instructions ?? "");
    formData.append("questionTypes", JSON.stringify(values.questionTypes));
    if (file) formData.append("file", file);

    const assignment = await toast.promise(assignmentApi.create(formData), {
      loading: "Creating assignment...",
      success: "Assignment queued for generation",
      error: "Could not create assignment",
    });
    router.push(`/assignments/${assignment._id}`);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-auto w-full max-w-2xl px-4 py-6 md:px-0">
      <div className="mb-6">
        <h1 className="text-xl font-extrabold">Create Assignment</h1>
        <p className="text-sm text-zinc-500">Set up a new assignment for your students</p>
      </div>

      <div className="mb-6 h-1 rounded-full bg-zinc-200">
        <div className="h-1 w-2/5 rounded-full bg-zinc-950" />
      </div>

      <Card className="p-5 md:p-7">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <h2 className="font-extrabold">Assignment Details</h2>
            <p className="text-xs text-zinc-500">Basic information about your assignment</p>
          </div>

          <FileDropzone value={file} onChange={setFile} />

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-xs font-bold">Assignment Title</span>
              <Input {...form.register("title")} />
            </label>
            <label className="space-y-2">
              <span className="text-xs font-bold">Due Date</span>
              <Input type="date" {...form.register("dueDate")} />
            </label>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-[1fr_88px_88px_32px] gap-2 text-xs font-bold text-zinc-600 max-sm:hidden">
              <span>Question Type</span>
              <span>No. of Questions</span>
              <span>Marks</span>
              <span />
            </div>
            {fields.map((field, index) => (
              <div key={field.id} className="grid gap-2 rounded-2xl bg-zinc-50 p-3 md:grid-cols-[1fr_88px_88px_32px] md:rounded-none md:bg-transparent md:p-0">
                <Controller
                  control={form.control}
                  name={`questionTypes.${index}.type`}
                  render={({ field: controllerField }) => (
                    <select
                      className="h-11 rounded-full border border-border bg-white px-4 text-sm"
                      {...controllerField}
                      onChange={(event) => {
                        const option = questionTypeOptions.find((item) => item.value === event.target.value);
                        controllerField.onChange(event);
                        form.setValue(`questionTypes.${index}.label`, option?.label ?? event.target.value);
                      }}
                    >
                      {questionTypeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}
                />
                <Input type="number" min={1} {...form.register(`questionTypes.${index}.count`, { valueAsNumber: true })} />
                <Input type="number" min={1} {...form.register(`questionTypes.${index}.marks`, { valueAsNumber: true })} />
                <button type="button" onClick={() => remove(index)} className="grid h-10 w-10 place-items-center rounded-full text-zinc-500">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => append({ type: "long", label: "Long Answer Questions", count: 2, marks: 5 })}
            >
              <Plus className="h-4 w-4" />
              Add Question Type
            </Button>
          </div>

          <div className="flex justify-end text-sm font-semibold">
            <div className="text-right">
              <p>Total Questions: {totalQuestions}</p>
              <p>Total Marks: {totalMarks}</p>
            </div>
          </div>

          <label className="space-y-2">
            <span className="text-xs font-bold">Additional Information (For better output)</span>
            <div className="relative">
              <Textarea {...form.register("instructions")} />
              <Mic className="absolute bottom-4 right-4 h-4 w-4 text-zinc-500" />
            </div>
          </label>

          <div className="sticky bottom-20 flex justify-between bg-white/80 py-2 backdrop-blur md:static">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Previous
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              Next
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
};
