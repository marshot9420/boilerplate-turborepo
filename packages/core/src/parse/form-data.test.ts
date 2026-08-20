import { describe, expect, it } from "vitest";

import { parseJsonFormDataValue, parseJsonFormDataValues } from "./form-data";

describe("parseJsonFormDataValue", () => {
  it("parses a JSON object", () => {
    const formData = new FormData();

    formData.set(
      "metadata",
      JSON.stringify({
        enabled: true,
      }),
    );

    expect(parseJsonFormDataValue(formData, "metadata")).toEqual({
      enabled: true,
    });
  });

  it("returns a non-JSON string unchanged", () => {
    const formData = new FormData();

    formData.set("name", "Mars");

    expect(parseJsonFormDataValue(formData, "name")).toBe("Mars");
  });

  it("returns undefined when the field does not exist", () => {
    const formData = new FormData();

    expect(parseJsonFormDataValue(formData, "missing")).toBeUndefined();
  });
});

describe("parseJsonFormDataValues", () => {
  it("parses all JSON values for a field", () => {
    const formData = new FormData();

    formData.append(
      "items",
      JSON.stringify({
        id: "first",
        quantity: 1,
      }),
    );

    formData.append(
      "items",
      JSON.stringify({
        id: "second",
        quantity: 2,
      }),
    );

    expect(parseJsonFormDataValues(formData, "items")).toEqual([
      {
        id: "first",
        quantity: 1,
      },
      {
        id: "second",
        quantity: 2,
      },
    ]);
  });

  it("returns an empty array when the field does not exist", () => {
    const formData = new FormData();

    expect(parseJsonFormDataValues(formData, "missing")).toEqual([]);
  });

  it("keeps invalid JSON values unchanged", () => {
    const formData = new FormData();

    formData.append("items", '{"invalid"');

    expect(parseJsonFormDataValues(formData, "items")).toEqual(['{"invalid"']);
  });

  it("keeps File values unchanged", () => {
    const formData = new FormData();

    const file = new File(["content"], "test.txt", {
      type: "text/plain",
    });

    formData.set("attachment", file);

    expect(parseJsonFormDataValue(formData, "attachment")).toBe(file);
  });
});
