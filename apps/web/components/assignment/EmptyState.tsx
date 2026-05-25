import Link from "next/link";
import { FileX2, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export const EmptyState = () => (
  <motion.section
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    className="grid min-h-[calc(100vh-9rem)] place-items-center rounded-none bg-[#eeeeee] px-6 md:rounded-[1.35rem]"
  >
    <div className="max-w-md text-center">
      <div className="relative mx-auto mb-6 grid h-40 w-40 place-items-center rounded-full bg-white shadow-soft">
        <FileX2 className="h-20 w-20 text-zinc-300" />
        <div className="absolute right-8 top-10 h-3 w-3 rounded-full bg-sky-500" />
        <div className="absolute left-7 bottom-12 h-3 w-3 rotate-45 border-2 border-sky-400" />
      </div>
      <h1 className="text-xl font-extrabold">No assignments yet</h1>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-zinc-500">
        Create your first assignment to start collecting and grading student submissions.
        AI can set rubrics, define marking criteria, and generate questions.
      </p>
      <Button asChild className="mt-6">
        <Link href="/assignments/new">
          <Plus className="h-4 w-4" />
          Create Your First Assignment
        </Link>
      </Button>
    </div>
  </motion.section>
);
