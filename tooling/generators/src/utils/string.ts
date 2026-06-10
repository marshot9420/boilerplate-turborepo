export function toPascalCase(value: string) {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

export function toCamelCase(value: string) {
  const pascal = toPascalCase(value);

  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

export function toConstantCase(value: string) {
  return value
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .split(/[-_\s]+/)
    .filter(Boolean)
    .join("_")
    .toUpperCase();
}

export function toKebabCase(value: string) {
  return value
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .split(/[-_\s]+/)
    .filter(Boolean)
    .join("-")
    .toLowerCase();
}
