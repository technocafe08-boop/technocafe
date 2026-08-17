import { useEffect } from "react";

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

export function useKonamiCode(onActivate: () => void) {
  useEffect(() => {
    let position = 0;
    function handleKey(e: KeyboardEvent) {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (key === KONAMI[position]) {
        position++;
        if (position === KONAMI.length) {
          onActivate();
          position = 0;
        }
      } else {
        position = key === KONAMI[0] ? 1 : 0;
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onActivate]);
}
