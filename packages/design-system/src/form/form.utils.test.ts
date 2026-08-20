import { describe, expect, it } from "vitest";

import { getFormStringValue, getTargetFieldName } from "./form.utils";

describe("getFormStringValue", () => {
  it("문자열 값을 trim하여 반환한다", () => {
    const formData = new FormData();

    formData.set("name", "  New Arrivals  ");

    expect(getFormStringValue(formData, "name")).toBe("New Arrivals");
  });

  it("문자열 내부의 공백은 유지한다", () => {
    const formData = new FormData();

    formData.set("name", "New   Arrivals");

    expect(getFormStringValue(formData, "name")).toBe("New   Arrivals");
  });

  it("빈 문자열이면 빈 문자열을 반환한다", () => {
    const formData = new FormData();

    formData.set("name", "   ");

    expect(getFormStringValue(formData, "name")).toBe("");
  });

  it("필드가 없으면 빈 문자열을 반환한다", () => {
    const formData = new FormData();

    expect(getFormStringValue(formData, "name")).toBe("");
  });

  it("값이 File이면 빈 문자열을 반환한다", () => {
    const formData = new FormData();
    const file = new File(["thumbnail"], "thumbnail.png", {
      type: "image/png",
    });

    formData.set("thumbnail", file);

    expect(getFormStringValue(formData, "thumbnail")).toBe("");
  });
});

describe("getTargetFieldName", () => {
  it("input의 name을 반환한다", () => {
    const input = document.createElement("input");

    input.name = "slug";

    expect(getTargetFieldName(input)).toBe("slug");
  });

  it("textarea의 name을 반환한다", () => {
    const textarea = document.createElement("textarea");

    textarea.name = "description";

    expect(getTargetFieldName(textarea)).toBe("description");
  });

  it("select의 name을 반환한다", () => {
    const select = document.createElement("select");

    select.name = "serviceScope";

    expect(getTargetFieldName(select)).toBe("serviceScope");
  });

  it("지원하는 요소라도 name이 없으면 undefined를 반환한다", () => {
    const input = document.createElement("input");

    expect(getTargetFieldName(input)).toBeUndefined();
  });

  it("input, textarea, select가 아니면 undefined를 반환한다", () => {
    const button = document.createElement("button");

    button.name = "submit";

    expect(getTargetFieldName(button)).toBeUndefined();
  });

  it("DOM 요소가 아닌 EventTarget이면 undefined를 반환한다", () => {
    expect(getTargetFieldName(new EventTarget())).toBeUndefined();
  });
});
