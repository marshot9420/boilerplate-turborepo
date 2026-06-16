"use client";

import { forwardRef } from "react";

import {
  FileInput as PrimitiveFileInput,
  type FileInputProps as PrimitiveFileInputProps,
} from "../../../primitives/inputs/file-input";
import { cn } from "../../../utils";

export type FileInputProps = PrimitiveFileInputProps;

const FileInput = forwardRef<HTMLInputElement, FileInputProps>(({ className, ...props }, ref) => {
  return (
    <PrimitiveFileInput
      ref={ref}
      className={cn(
        "border-border bg-surface shadow-xs",
        "file:bg-muted file:text-foreground",
        "file:transition-colors",
        "md:hover:border-primary/60 md:hover:file:bg-muted/80",
        "focus-visible:ring-0 focus-visible:ring-offset-0",
        "focus-visible:border-ring",
        "data-[invalid=true]:border-destructive",
        "data-[disabled=true]:bg-muted",
        className,
      )}
      {...props}
    />
  );
});

FileInput.displayName = "FileInput";

export default FileInput;
