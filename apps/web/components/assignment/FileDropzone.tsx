"use client";

import { useRef, useState } from "react";
import { CloudUpload } from "lucide-react";
import { cn } from "@/lib/utils";

export const FileDropzone = ({
  value,
  onChange,
}: {
  value?: File;
  onChange: (file?: File) => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        onChange(event.dataTransfer.files[0]);
      }}
      className={cn(
        "grid min-h-44 place-items-center rounded-2xl border border-dashed border-zinc-300 bg-white p-6 text-center transition",
        dragging && "border-primary bg-primary/5",
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.txt,text/plain,application/pdf"
        className="hidden"
        onChange={(event) => onChange(event.target.files?.[0])}
      />
      <div>
        <CloudUpload className="mx-auto mb-3 h-8 w-8 text-zinc-700" />
        <p className="text-sm font-semibold">{value ? value.name : "Choose a file or drag & drop it here"}</p>
        <p className="mt-1 text-xs text-zinc-500">PDF, text, and notes up to 8MB</p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-4 rounded-full bg-zinc-100 px-4 py-2 text-xs font-bold"
        >
          Browse Files
        </button>
      </div>
    </div>
  );
};
