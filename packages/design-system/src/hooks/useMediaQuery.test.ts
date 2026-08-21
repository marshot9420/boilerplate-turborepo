import { act, renderHook } from "@testing-library/react";

import { useMediaQuery } from "./useMediaQuery";

interface MatchMediaController {
  mediaQueryList: MediaQueryList;
  setMatches: (matches: boolean) => void;
}

function createMatchMediaController(query: string, initialMatches: boolean): MatchMediaController {
  const listeners = new Set<EventListenerOrEventListenerObject>();
  let matches = initialMatches;

  const mediaQueryList = {
    get matches() {
      return matches;
    },
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn((type: string, listener: EventListenerOrEventListenerObject) => {
      if (type === "change") {
        listeners.add(listener);
      }
    }),
    removeEventListener: vi.fn((type: string, listener: EventListenerOrEventListenerObject) => {
      if (type === "change") {
        listeners.delete(listener);
      }
    }),
    dispatchEvent: vi.fn(() => true),
  } as MediaQueryList;

  return {
    mediaQueryList,
    setMatches(nextMatches) {
      matches = nextMatches;

      const event = { matches, media: query } as MediaQueryListEvent;

      listeners.forEach((listener) => {
        if (typeof listener === "function") {
          listener(event);
          return;
        }

        listener.handleEvent(event);
      });
    },
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("useMediaQuery", () => {
  it("현재 Media Query 상태를 반환하고 변경을 반영한다", () => {
    const controller = createMatchMediaController("(min-width: 768px)", true);
    const matchMediaMock = vi.fn(() => controller.mediaQueryList);

    vi.stubGlobal("matchMedia", matchMediaMock);

    const { result } = renderHook(() => useMediaQuery("(min-width: 768px)"));

    expect(result.current).toBe(true);
    expect(matchMediaMock).toHaveBeenCalledWith("(min-width: 768px)");

    act(() => {
      controller.setMatches(false);
    });

    expect(result.current).toBe(false);
  });

  it("Query가 바뀌거나 Hook이 해제되면 기존 Listener를 정리한다", () => {
    const mobileController = createMatchMediaController("(max-width: 767px)", false);
    const desktopController = createMatchMediaController("(min-width: 768px)", true);
    const controllers = new Map([
      ["(max-width: 767px)", mobileController],
      ["(min-width: 768px)", desktopController],
    ]);
    const matchMediaMock = vi.fn((query: string) => {
      const controller = controllers.get(query);

      if (!controller) {
        throw new Error(`Unexpected Media Query: ${query}`);
      }

      return controller.mediaQueryList;
    });

    vi.stubGlobal("matchMedia", matchMediaMock);

    const { result, rerender, unmount } = renderHook(({ query }) => useMediaQuery(query), {
      initialProps: { query: "(max-width: 767px)" },
    });
    const mobileListener = vi.mocked(mobileController.mediaQueryList.addEventListener).mock
      .calls[0]?.[1];

    expect(result.current).toBe(false);
    expect(mobileListener).toEqual(expect.any(Function));

    rerender({ query: "(min-width: 768px)" });

    expect(result.current).toBe(true);
    expect(mobileController.mediaQueryList.removeEventListener).toHaveBeenCalledWith(
      "change",
      mobileListener,
    );

    const desktopListener = vi.mocked(desktopController.mediaQueryList.addEventListener).mock
      .calls[0]?.[1];

    unmount();

    expect(desktopController.mediaQueryList.removeEventListener).toHaveBeenCalledWith(
      "change",
      desktopListener,
    );
  });
});
