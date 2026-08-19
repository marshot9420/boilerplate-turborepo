export { generateComponent } from "./component.generator";
export { generateDomain } from "./domain.generator";
export { generateEntity } from "./entity.generator";
export { generateFeature } from "./feature.generator";

export const availableGenerators = ["component", "domain", "entity", "feature"] as const;

export type GeneratorType = (typeof availableGenerators)[number];

export function isGeneratorType(value: string): value is GeneratorType {
  return availableGenerators.includes(value as GeneratorType);
}
