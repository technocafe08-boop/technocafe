import { useRef, useState } from "react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";

export default function TiltCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  function handleMouseMove(e: React.MouseEvent) {
    if (!ref.current || window.matchMedia("(hover: none)").matches) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setRotate({ x: -py * 7, y: px * 7 });
  }

  function handleLeave() {
    setRotate({ x: 0, y: 0 });
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleLeave}
      animate={{ rotateX: rotate.x, rotateY: rotate.y }}
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 180, damping: 24 }}
      style={{ transformStyle: "preserve-3d" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
