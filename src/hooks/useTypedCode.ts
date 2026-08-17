import { useEffect } from "react";

export function useTypedCode(code: string, onActivate: () => void) {
  useEffect(() => {
    let buffer = "";
    function handleKey(e: KeyboardEvent) {
      if (e.key.length > 1) return;
      buffer += e.key.toLowerCase();
      buffer = buffer.slice(-code.length);
      if (buffer === code) {
        onActivate();
        buffer = "";
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [code, onActivate]);
}
