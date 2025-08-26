// components/forms/FileUpload.tsx
"use client";

import { useRef } from "react";

interface FileUploadProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  label?: string;
}

export function FileUpload({
  files,
  onFilesChange,
  label = "File Attachments",
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFilesChange(Array.from(e.target.files));
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      onFilesChange(Array.from(e.dataTransfer.files));
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-2">
        {label}
      </label>
      <div
        onDrop={handleFileDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-white/20 bg-white/5 p-8 text-center hover:border-white/30 hover:bg-white/10 transition-all duration-200 cursor-pointer"
        onClick={() => inputRef.current?.click()}
      >
        <svg
          className="w-12 h-12 text-slate-400 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <p className="text-slate-400 mb-2">
          {files.length > 0
            ? `${files.length} file(s) selected`
            : "Drag and drop files here, or click to select"}
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
}
