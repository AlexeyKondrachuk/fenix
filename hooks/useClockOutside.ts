import { useEffect, type RefObject } from "react";

export function useClickOutside(
  ref: RefObject<HTMLElement | null>,
  callback: (event: PointerEvent) => void,
) {
  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      const element = ref.current;
      if (element && !event.composedPath().includes(element)) callback(event);
    }

    document.addEventListener("pointerdown", handlePointerDown, true);
    return () => document.removeEventListener("pointerdown", handlePointerDown, true);
  }, [ref, callback]);
}
