import { describe, expect, it } from "vitest";

import { getNumberSearchParam, getSearchParam } from "./search-params";

describe("getSearchParam", () => {
  it("returns the search param value", () => {
    const searchParams = new URLSearchParams({
      keyword: "hello",
    });

    expect(getSearchParam(searchParams, "keyword")).toBe("hello");
  });

  it("returns undefined when the search param does not exist", () => {
    const searchParams = new URLSearchParams();

    expect(getSearchParam(searchParams, "keyword")).toBeUndefined();
  });

  it("returns undefined when the search param is empty", () => {
    const searchParams = new URLSearchParams({
      keyword: "",
    });

    expect(getSearchParam(searchParams, "keyword")).toBeUndefined();
  });
});

describe("getNumberSearchParam", () => {
  it("returns the parsed number", () => {
    const searchParams = new URLSearchParams({
      page: "3",
    });

    expect(getNumberSearchParam(searchParams, "page")).toBe(3);
  });

  it("returns undefined when the search param does not exist", () => {
    const searchParams = new URLSearchParams();

    expect(getNumberSearchParam(searchParams, "page")).toBeUndefined();
  });

  it("returns undefined when the value is not a number", () => {
    const searchParams = new URLSearchParams({
      page: "invalid",
    });

    expect(getNumberSearchParam(searchParams, "page")).toBeUndefined();
  });
});
