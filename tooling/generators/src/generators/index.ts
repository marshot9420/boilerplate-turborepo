export { generateComponent } from "./component.generator";
export { generateDomain } from "./domain.generator";
export { generateFeature } from "./feature.generator";

export const availableGenerators = ["domain", "component", "feature"] as const;

export type GeneratorType = (typeof availableGenerators)[number];

export function isGeneratorType(type: string): type is GeneratorType {
  return availableGenerators.includes(type as GeneratorType);
}
