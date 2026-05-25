"use client";

import Link from "next/link";
import { MoreVertical, Plus, Search, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "./EmptyState";
import { formatDate } from "@/lib/utils";
import type { Assignment } from "@/types/assignment";

export const AssignmentList = ({ assignments }: { assignments: Assignment[] }) => {
  if (assignments.length === 0) return <EmptyState />;

  return (
    <section className="relative flex-1 overflow-hidden rounded-none bg-[#eeeeee] md:rounded-[1.35rem]">
      <div className="sticky top-16 z-20 border-b border-zinc-200/80 bg-[#eeeeee]/95 p-4 backdrop-blur md:top-0 md:p-0 md:pb-4">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-emerald-400" />
              <h1 className="text-xl font-extrabold">Assignments</h1>
            </div>
            <p className="text-sm text-zinc-500">Manage and review assignments for your classes.</p>
          </div>
          <Button asChild className="hidden md:inline-flex">
            <Link href="/assignments/new">
              <Plus className="h-4 w-4" />
              Create Assignment
            </Link>
          </Button>
        </div>
        <Card className="flex items-center gap-3 rounded-2xl p-2 shadow-sm">
          <Button variant="ghost" size="sm" className="rounded-xl text-zinc-500">
            <SlidersHorizontal className="h-4 w-4" />
            Filter
          </Button>
          <div className="ml-auto flex h-10 w-full max-w-sm items-center gap-2 rounded-full border border-border px-4 text-zinc-400">
            <Search className="h-4 w-4" />
            <span className="text-sm">Search Assignment</span>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 p-4 md:grid-cols-2 md:p-0 md:pb-28">
        {assignments.map((assignment, index) => (
          <motion.div
            key={assignment._id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
          >
            <Link href={`/assignments/${assignment._id}`}>
              <Card className="group min-h-[136px] p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-extrabold">{assignment.title}</h2>
                    <Badge className="mt-2 capitalize">{assignment.status}</Badge>
                  </div>
                  <MoreVertical className="h-5 w-5 text-zinc-400" />
                </div>
                <div className="mt-7 flex items-center justify-between text-sm">
                  <p>
                    <span className="font-bold">Assigned on:</span>{" "}
                    <span className="text-zinc-500">{formatDate(assignment.createdAt)}</span>
                  </p>
                  <p>
                    <span className="font-bold">Due:</span>{" "}
                    <span className="text-zinc-500">{formatDate(assignment.dueDate)}</span>
                  </p>
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
