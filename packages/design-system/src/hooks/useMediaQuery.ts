"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

const getServerSnapshot = () => false;

export function useMediaQuery(query: string): boolean {
  const mediaQueryList = useMemo(
    () => (typeof window === "undefined" ? null : window.matchMedia(query)),
    [query],
  );

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      if (!mediaQueryList) {
        return () => undefined;
      }

      mediaQueryList.addEventListener("change", onStoreChange);

      return () => {
        mediaQueryList.removeEventListener("change", onStoreChange);
      };
    },
    [mediaQueryList],
  );

  const getSnapshot = useCallback(() => mediaQueryList?.matches ?? false, [mediaQueryList]);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
