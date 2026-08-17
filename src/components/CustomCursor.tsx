import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const trailRef = useRef<{ x: number; y: number }[]>([]);
  const trailEls = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px) and (hover: hover)");
    setIsDesktop(mq.matches);
    const listener = () => setIsDesktop(mq.matches);
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;
    const dot = dotRef.current;
    if (!dot) return;

    let mouseX = 0, mouseY = 0;

    function onMove(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dot) {
        dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
      }
      trailRef.current.push({ x: mouseX, y: mouseY });
      if (trailRef.current.length > 8) trailRef.current.shift();
      trailEls.current.forEach((el, i) => {
        const point = trailRef.current[trailRef.current.length - 1 - i];
        if (el && point) {
          el.style.transform = `translate(${point.x}px, ${point.y}px) translate(-50%, -50%)`;
          el.style.opacity = `${1 - i / 8}`;
        }
      });
    }

    function onOver(e: MouseEvent) {
      if (!dot) return;
      const target = e.target as HTMLElement;
      if (target.closest("button, a, [data-cursor-hover]")) {
        dot.style.width = "34px";
        dot.style.height = "34px";
        dot.style.borderColor = "#0066FF";
      } else {
        dot.style.width = "14px";
        dot.style.height = "14px";
        dot.style.borderColor = "#00C2FF";
      }
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
    };
  }, [isDesktop]);

  if (!isDesktop) return null;

  const colors = ["#00C2FF", "#00FFC2", "#0066FF", "#00C2FF", "#00FFC2", "#0066FF", "#00C2FF", "#00FFC2"];

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      {colors.map((c, i) => (
        <div
          key={i}
          ref={(el) => { if (el) trailEls.current[i] = el; }}
          className="rgb-cursor-trail"
          style={{
            width: `${8 - i * 0.7}px`,
            height: `${8 - i * 0.7}px`,
            background: c,
            opacity: 0,
          }}
        />
      ))}
    </>
  );
}
