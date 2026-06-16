import { render, screen } from "@testing-library/react";

import { createRef } from "react";

import ImageFrame from "./image-frame";

describe("Web ImageFrame", () => {
  it("이미지를 렌더링한다", () => {
    render(<ImageFrame data-testid="image-frame" src="/sample.jpg" alt="샘플 이미지" />);

    const image = screen.getByRole("img", {
      name: "샘플 이미지",
    });

    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "/sample.jpg");
  });

  it("alt가 없으면 빈 문자열 alt를 사용한다", () => {
    render(<ImageFrame src="/sample.jpg" />);

    expect(screen.getByRole("presentation")).toHaveAttribute("alt", "");
  });

  it("src가 없으면 fallback을 렌더링한다", () => {
    render(
      <ImageFrame data-testid="image-frame" fallback={<span>이미지를 불러올 수 없습니다</span>} />,
    );

    expect(screen.getByText("이미지를 불러올 수 없습니다")).toBeInTheDocument();
    expect(screen.getByTestId("image-frame")).toHaveAttribute("data-has-image", "false");
  });

  it("children을 overlay 콘텐츠로 렌더링한다", () => {
    render(
      <ImageFrame src="/sample.jpg" alt="샘플 이미지">
        <span>오버레이</span>
      </ImageFrame>,
    );

    expect(screen.getByText("오버레이")).toBeInTheDocument();
  });

  it("기본 ratio, fit, variant data attribute를 가진다", () => {
    render(<ImageFrame data-testid="image-frame" src="/sample.jpg" alt="샘플 이미지" />);

    const imageFrame = screen.getByTestId("image-frame");

    expect(imageFrame).toHaveAttribute("data-ratio", "auto");
    expect(imageFrame).toHaveAttribute("data-fit", "cover");
    expect(imageFrame).toHaveAttribute("data-variant", "default");
    expect(imageFrame).toHaveAttribute("data-has-image", "true");
  });

  it("ratio, fit, fullWidth primitive prop을 전달한다", () => {
    render(
      <ImageFrame
        data-testid="image-frame"
        src="/sample.jpg"
        alt="샘플 이미지"
        ratio="square"
        fit="contain"
        fullWidth
      />,
    );

    const imageFrame = screen.getByTestId("image-frame");
    const image = screen.getByRole("img", {
      name: "샘플 이미지",
    });

    expect(imageFrame).toHaveAttribute("data-ratio", "square");
    expect(imageFrame).toHaveAttribute("data-fit", "contain");
    expect(imageFrame).toHaveAttribute("data-full-width", "true");
    expect(image).toHaveClass("object-contain");
  });

  it("variant를 적용한다", () => {
    render(
      <ImageFrame data-testid="image-frame" src="/sample.jpg" alt="샘플 이미지" variant="muted" />,
    );

    expect(screen.getByTestId("image-frame")).toHaveAttribute("data-variant", "muted");
  });

  it("imageClassName을 이미지에 병합한다", () => {
    render(<ImageFrame src="/sample.jpg" alt="샘플 이미지" imageClassName="custom-image" />);

    expect(
      screen.getByRole("img", {
        name: "샘플 이미지",
      }),
    ).toHaveClass("custom-image");
  });

  it("imageProps를 이미지에 전달한다", () => {
    render(
      <ImageFrame
        src="/sample.jpg"
        alt="샘플 이미지"
        imageProps={{
          loading: "lazy",
          decoding: "async",
        }}
      />,
    );

    const image = screen.getByRole("img", {
      name: "샘플 이미지",
    });

    expect(image).toHaveAttribute("loading", "lazy");
    expect(image).toHaveAttribute("decoding", "async");
  });

  it("className을 병합한다", () => {
    render(
      <ImageFrame
        data-testid="image-frame"
        src="/sample.jpg"
        alt="샘플 이미지"
        className="custom-frame"
      />,
    );

    expect(screen.getByTestId("image-frame")).toHaveClass("custom-frame");
  });

  it("ref를 전달한다", () => {
    const ref = createRef<HTMLDivElement>();

    render(<ImageFrame ref={ref} src="/sample.jpg" alt="샘플 이미지" />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
