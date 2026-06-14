"use client";

import { Toaster } from "sonner";

import type { ComponentProps } from "react";

export type ToastProviderProps = ComponentProps<typeof Toaster>;

export function ToastProvider({
  richColors = true,
  closeButton = true,
  position = "top-right",
  ...props
}: ToastProviderProps) {
  return (
    <Toaster
      richColors={richColors}
      closeButton={closeButton}
      position={position}
      {...props}
    />
  );
}
