export * from "./domain.generator";

export const availableGenerators = ["domain", "feature", "package"] as const;

export type GeneratorType = (typeof availableGenerators)[number];

export function isGeneratorType(value: string): value is GeneratorType {
  return availableGenerators.includes(value as GeneratorType);
}
