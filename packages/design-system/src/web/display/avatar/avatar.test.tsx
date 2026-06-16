import { fireEvent, render, screen } from "@testing-library/react";

import { createRef } from "react";

import Avatar from "./avatar";

describe("Web Avatar", () => {
  it("fallback avatar를 렌더링한다", () => {
    render(<Avatar fallback="M" />);

    const avatar = screen.getByText("M");

    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute("data-ds-component", "avatar");
    expect(avatar).toHaveAttribute("data-has-image", "false");
  });

  it("web avatar 스타일을 적용한다", () => {
    render(<Avatar fallback="M" />);

    const avatar = screen.getByText("M");

    expect(avatar).toHaveClass("ring-2");
    expect(avatar).toHaveClass("ring-background");
    expect(avatar).toHaveClass("shadow-sm");
    expect(avatar).toHaveClass("size-11");
  });

  it("이미지를 렌더링한다", () => {
    render(<Avatar alt="MARSHOT" fallback="M" src="/avatar.png" />);

    const image = screen.getByRole("img", {
      name: "MARSHOT",
    });

    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "/avatar.png");
    expect(image).toHaveClass("transition-transform");
    expect(image.parentElement).toHaveAttribute("data-has-image", "true");
  });

  it("alt가 없으면 빈 alt를 적용한다", () => {
    const { container } = render(<Avatar fallback="M" src="/avatar.png" />);

    const image = container.querySelector("img");

    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("alt", "");
  });

  it("이미지 로딩에 실패하면 fallback을 렌더링한다", () => {
    render(<Avatar alt="MARSHOT" fallback="M" src="/avatar.png" />);

    fireEvent.error(
      screen.getByRole("img", {
        name: "MARSHOT",
      }),
    );

    const fallback = screen.getByText("M");

    expect(fallback).toBeInTheDocument();
    expect(fallback).toHaveAttribute("data-has-image", "false");
  });

  it("size와 shape 상태를 전달한다", () => {
    render(<Avatar fallback="M" shape="square" size="lg" />);

    const avatar = screen.getByText("M");

    expect(avatar).toHaveAttribute("data-size", "lg");
    expect(avatar).toHaveAttribute("data-shape", "square");
    expect(avatar).toHaveClass("size-14");
    expect(avatar).toHaveClass("rounded-xl");
  });

  it("imageClassName과 imageProps를 적용한다", () => {
    render(
      <Avatar
        alt="MARSHOT"
        fallback="M"
        imageClassName="custom-image"
        imageProps={{
          loading: "lazy",
        }}
        src="/avatar.png"
      />,
    );

    const image = screen.getByRole("img", {
      name: "MARSHOT",
    });

    expect(image).toHaveClass("custom-image");
    expect(image).toHaveAttribute("loading", "lazy");
  });

  it("className을 병합한다", () => {
    render(<Avatar className="custom-avatar" fallback="M" />);

    const avatar = screen.getByText("M");

    expect(avatar).toHaveClass("custom-avatar");
    expect(avatar).toHaveClass("ring-2");
  });

  it("ref를 전달한다", () => {
    const ref = createRef<HTMLSpanElement>();

    render(<Avatar ref={ref} fallback="M" />);

    expect(ref.current).toBe(screen.getByText("M"));
  });
});
