import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { createRef } from "react";

import Avatar from "./avatar";

describe("Avatar", () => {
  it("fallback을 렌더링한다", () => {
    render(<Avatar fallback="MS" />);

    expect(screen.getByText("MS")).toBeInTheDocument();
  });

  it("src가 있으면 이미지를 렌더링한다", () => {
    render(<Avatar src="/avatar.png" alt="Avatar" fallback="MS" />);

    const image = screen.getByRole("img", { name: "Avatar" });

    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "/avatar.png");
  });

  it("이미지 로딩에 실패하면 fallback을 렌더링한다", () => {
    render(<Avatar src="/broken.png" alt="Broken" fallback="MS" />);

    fireEvent.error(screen.getByRole("img", { name: "Broken" }));

    expect(screen.getByText("MS")).toBeInTheDocument();
    expect(
      screen.queryByRole("img", { name: "Broken" }),
    ).not.toBeInTheDocument();
  });

  it("기본 size와 shape을 data attribute로 노출한다", () => {
    render(<Avatar data-testid="avatar" fallback="MS" />);

    const avatar = screen.getByTestId("avatar");

    expect(avatar).toHaveAttribute("data-size", "md");
    expect(avatar).toHaveAttribute("data-shape", "circle");
  });

  it("전달한 size와 shape을 data attribute로 노출한다", () => {
    render(
      <Avatar data-testid="avatar" size="lg" shape="square" fallback="MS" />,
    );

    const avatar = screen.getByTestId("avatar");

    expect(avatar).toHaveAttribute("data-size", "lg");
    expect(avatar).toHaveAttribute("data-shape", "square");
  });

  it("이미지 존재 여부를 data-has-image로 노출한다", () => {
    render(<Avatar data-testid="avatar" src="/avatar.png" alt="Avatar" />);

    expect(screen.getByTestId("avatar")).toHaveAttribute(
      "data-has-image",
      "true",
    );
  });

  it("className과 imageClassName을 병합한다", () => {
    render(
      <Avatar
        data-testid="avatar"
        src="/avatar.png"
        alt="Avatar"
        className="custom-avatar"
        imageClassName="custom-image"
      />,
    );

    expect(screen.getByTestId("avatar")).toHaveClass("custom-avatar");
    expect(screen.getByRole("img", { name: "Avatar" })).toHaveClass(
      "custom-image",
    );
  });

  it("imageProps를 img element에 전달한다", () => {
    render(
      <Avatar
        src="/avatar.png"
        alt="Avatar"
        imageProps={{
          loading: "lazy",
          decoding: "async",
        }}
      />,
    );

    const image = screen.getByRole("img", { name: "Avatar" });

    expect(image).toHaveAttribute("loading", "lazy");
    expect(image).toHaveAttribute("decoding", "async");
  });

  it("ref를 span element로 전달한다", () => {
    const ref = createRef<HTMLSpanElement>();

    render(<Avatar ref={ref} fallback="MS" />);

    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });
});
