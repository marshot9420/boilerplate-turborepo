import { composeStories } from "@storybook/react";
import { render, screen } from "@testing-library/react";

import * as stories from "./Button.stories";

const ButtonStories = composeStories(stories);

describe("Button", () => {
  it("버튼을 렌더링합니다.", () => {
    render(<ButtonStories.Default />);

    const button: HTMLElement = screen.getByRole("button", { name: "Button" });

    expect(button).toBeInTheDocument();
  });
});
