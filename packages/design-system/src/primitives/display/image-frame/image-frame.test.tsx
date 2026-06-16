import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { createRef } from "react";

import ImageFrame from "./image-frame";

describe("ImageFrame", () => {
  it("src가 있으면 이미지를 렌더링한다", () => {
    render(<ImageFrame src="/image.png" alt="이미지" />);

    const image = screen.getByRole("img", { name: "이미지" });

    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "/image.png");
  });

  it("src가 없으면 fallback을 렌더링한다", () => {
    render(<ImageFrame fallback={<span>이미지가 없습니다</span>} />);

    expect(screen.getByText("이미지가 없습니다")).toBeInTheDocument();
  });

  it("children을 렌더링한다", () => {
    render(
      <ImageFrame src="/image.png" alt="이미지">
        <span>오버레이</span>
      </ImageFrame>,
    );

    expect(screen.getByText("오버레이")).toBeInTheDocument();
  });

  it("기본 ratio, fit, fullWidth, hasImage 상태를 data attribute로 노출한다", () => {
    render(<ImageFrame data-testid="image-frame" />);

    const frame = screen.getByTestId("image-frame");

    expect(frame).toHaveAttribute("data-ratio", "auto");
    expect(frame).toHaveAttribute("data-fit", "cover");
    expect(frame).toHaveAttribute("data-full-width", "false");
    expect(frame).toHaveAttribute("data-has-image", "false");
  });

  it("전달한 ratio, fit, fullWidth, hasImage 상태를 data attribute로 노출한다", () => {
    render(
      <ImageFrame
        data-testid="image-frame"
        src="/image.png"
        alt="이미지"
        ratio="square"
        fit="contain"
        fullWidth
      />,
    );

    const frame = screen.getByTestId("image-frame");

    expect(frame).toHaveAttribute("data-ratio", "square");
    expect(frame).toHaveAttribute("data-fit", "contain");
    expect(frame).toHaveAttribute("data-full-width", "true");
    expect(frame).toHaveAttribute("data-has-image", "true");
  });

  it("fit이 contain이면 object-contain class를 적용한다", () => {
    render(<ImageFrame src="/image.png" alt="이미지" fit="contain" />);

    expect(screen.getByRole("img", { name: "이미지" })).toHaveClass("object-contain");
  });

  it("fit 기본값은 object-cover class를 적용한다", () => {
    render(<ImageFrame src="/image.png" alt="이미지" />);

    expect(screen.getByRole("img", { name: "이미지" })).toHaveClass("object-cover");
  });

  it("className과 imageClassName을 병합한다", () => {
    render(
      <ImageFrame
        data-testid="image-frame"
        src="/image.png"
        alt="이미지"
        className="custom-frame"
        imageClassName="custom-image"
      />,
    );

    expect(screen.getByTestId("image-frame")).toHaveClass("custom-frame");
    expect(screen.getByRole("img", { name: "이미지" })).toHaveClass("custom-image");
  });

  it("imageProps를 img element에 전달한다", () => {
    render(
      <ImageFrame
        src="/image.png"
        alt="이미지"
        imageProps={{
          loading: "lazy",
          decoding: "async",
        }}
      />,
    );

    const image = screen.getByRole("img", { name: "이미지" });

    expect(image).toHaveAttribute("loading", "lazy");
    expect(image).toHaveAttribute("decoding", "async");
  });

  it("ref를 div element로 전달한다", () => {
    const ref = createRef<HTMLDivElement>();

    render(<ImageFrame ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
