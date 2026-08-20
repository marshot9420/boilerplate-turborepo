type FormDataValue = ReturnType<FormData["get"]>;

function parseJsonFormDataEntry(value: FormDataValue): unknown {
  if (value === null) {
    return undefined;
  }

  if (typeof value !== "string") {
    return value;
  }

  try {
    return JSON.parse(value) as unknown;
  } catch {
    return value;
  }
}

export function parseJsonFormDataValue(formData: FormData, fieldName: string): unknown {
  return parseJsonFormDataEntry(formData.get(fieldName));
}

export function parseJsonFormDataValues(formData: FormData, fieldName: string): unknown[] {
  return formData.getAll(fieldName).map((value) => parseJsonFormDataEntry(value));
}
