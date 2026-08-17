import { useRef, useState } from "react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface Props {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export default function MagneticButton({
  children,
  onClick,
  className,
  type = "button",
  disabled,
}: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  function handleMouseMove(e: React.MouseEvent) {
    if (!ref.current || window.matchMedia("(hover: none)").matches) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.35;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.35;
    setOffset({ x, y });
  }

  function handleLeave() {
    setOffset({ x: 0, y: 0 });
  }

  function handlePress(e: React.MouseEvent | React.TouchEvent) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const point = "touches" in e ? e.touches[0] : (e as React.MouseEvent);
    const x = point.clientX - rect.left;
    const y = point.clientY - rect.top;
    const id = Date.now();
    setRipples((r) => [...r, { id, x, y }]);
    setTimeout(() => setRipples((r) => r.filter((rp) => rp.id !== id)), 600);
    onClick?.();
  }

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleLeave}
      onClick={handlePress}
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: "spring", stiffness: 150, damping: 12 }}
      whileTap={{ scale: 0.95 }}
      className={`relative overflow-hidden ${className ?? ""}`}
      data-cursor-hover
    >
      {children}
      {ripples.map((r) => (
        <span
          key={r.id}
          className="absolute rounded-full bg-white/40 pointer-events-none animate-ping"
          style={{ left: r.x - 10, top: r.y - 10, width: 20, height: 20 }}
        />
      ))}
    </motion.button>
  );
}
