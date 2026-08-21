import type { Decorator } from "@storybook/react-vite";

import { useEffect } from "react";

import basePreview from "@repo/storybook-config/preview";

import { ToastProvider } from "../src/toast";

import "../src/styles/storybook.css";

const baseDecorators = Array.isArray(basePreview.decorators)
  ? basePreview.decorators
  : basePreview.decorators
    ? [basePreview.decorators]
    : [];

type DesignSystemTheme = "web" | "admin";

function resolveDesignSystemTheme(title: string, parameter: unknown): DesignSystemTheme {
  if (parameter === "web" || parameter === "admin") {
    return parameter;
  }

  return title.startsWith("Admin/") ? "admin" : "web";
}

const DesignSystemDecorator: Decorator = (Story, context) => {
  const theme = resolveDesignSystemTheme(context.title, context.parameters["dsTheme"]);

  useEffect(() => {
    const root = document.documentElement;
    const previousTheme = root.getAttribute("data-ds-theme");
    const previousMode = root.getAttribute("data-ds-mode");

    root.setAttribute("data-ds-theme", theme);
    root.setAttribute("data-ds-mode", "light");

    return () => {
      if (previousTheme === null) {
        root.removeAttribute("data-ds-theme");
      } else {
        root.setAttribute("data-ds-theme", previousTheme);
      }

      if (previousMode === null) {
        root.removeAttribute("data-ds-mode");
      } else {
        root.setAttribute("data-ds-mode", previousMode);
      }
    };
  }, [theme]);

  return (
    <div
      data-ds-theme={theme}
      data-ds-mode="light"
      className="bg-background text-foreground min-h-screen p-6"
    >
      <Story />
      <ToastProvider />
    </div>
  );
};

const preview: typeof basePreview = {
  ...basePreview,
  decorators: [...baseDecorators, DesignSystemDecorator],
};

export default preview;
