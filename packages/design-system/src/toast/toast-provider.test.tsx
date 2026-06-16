import { render, screen } from "@testing-library/react";

import ToastProvider from "./toast-provider";

vi.mock("sonner", () => ({
  Toaster: ({
    richColors,
    closeButton,
    position,
    ...props
  }: {
    richColors?: boolean;
    closeButton?: boolean;
    position?: string;
    [key: string]: unknown;
  }) => {
    return (
      <div
        data-testid={(props["data-testid"] as string | undefined) ?? "toaster"}
        data-rich-colors={String(richColors)}
        data-close-button={String(closeButton)}
        data-position={position}
      />
    );
  },
}));

describe("ToastProvider", () => {
  it("기본 props로 Toaster를 렌더링한다", () => {
    render(<ToastProvider />);

    const toaster = screen.getByTestId("toaster");

    expect(toaster).toHaveAttribute("data-rich-colors", "true");
    expect(toaster).toHaveAttribute("data-close-button", "true");
    expect(toaster).toHaveAttribute("data-position", "top-right");
  });

  it("props를 덮어쓸 수 있다", () => {
    render(
      <ToastProvider
        data-testid="custom-toaster"
        richColors={false}
        closeButton={false}
        position="bottom-center"
      />,
    );

    const toaster = screen.getByTestId("custom-toaster");

    expect(toaster).toHaveAttribute("data-rich-colors", "false");
    expect(toaster).toHaveAttribute("data-close-button", "false");
    expect(toaster).toHaveAttribute("data-position", "bottom-center");
  });
});
