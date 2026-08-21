import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import ParticleField from "./ParticleField";
import MagneticButton from "./MagneticButton";
import logoHome from "../assets/logo-home.png";

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const listener = () => setIsDesktop(mq.matches);
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
  }, []);

  function handleMouseMove(e: React.MouseEvent) {
    if (!isDesktop || !heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x, y });
  }

  return (
    <section
      ref={heroRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[100svh] md:h-[100svh] w-full overflow-hidden flex items-center justify-center bg-bg pt-20 md:pt-0 pb-10 md:pb-0"
    >
      {/* Grid floor */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1/2 grid-floor opacity-40"
        style={{
          transform: `perspective(600px) rotateX(65deg) translateY(${isDesktop ? tilt.y * 10 : 0}px)`,
          maskImage: "linear-gradient(to top, black, transparent)",
          WebkitMaskImage: "linear-gradient(to top, black, transparent)",
        }}
      />

      {/* Smoke / glow blobs */}
      <motion.div
        className="absolute -left-20 top-1/3 w-72 h-72 rounded-full bg-purple/25 blur-[90px]"
        animate={{ x: [0, 40, 0], y: [0, 20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-16 top-1/4 w-80 h-80 rounded-full bg-pink/20 blur-[100px]"
        animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-1/3 bottom-0 w-96 h-96 rounded-full bg-cyan/15 blur-[110px]"
        animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      <ParticleField />

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-4 -translate-y-6 md:translate-y-0"
        style={{
          transform: isDesktop
            ? `rotateY(${tilt.x * 4}deg) rotateX(${-tilt.y * 4}deg)`
            : undefined,
          transformStyle: "preserve-3d",
        }}
      >
        <motion.img
          src={logoHome}
          alt="Techno Cafe Logo"
          className="w-full max-w-[250px] xs:max-w-[320px] md:max-w-[480px] lg:max-w-[560px] h-auto select-none drop-shadow-[0_15px_30px_rgba(0,194,255,0.25)]"
          draggable={false}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />

        <motion.div
          className="mt-6 md:mt-9"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <MagneticButton
            onClick={() => document.querySelector("#games")?.scrollIntoView({ behavior: "smooth" })}
            className="relative font-heading tracking-[0.2em] text-sm md:text-base font-bold px-9 py-4 md:px-11 md:py-5 rounded-full text-black bg-gradient-to-r from-cyan to-purple neon-box-cyan min-h-[48px] w-full xs:w-auto"
          >
            PLAY NOW
          </MagneticButton>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden w-6 h-10 rounded-full border-2 border-cyan/60 md:flex justify-center pt-2"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <motion.div
          className="w-1 h-2 rounded-full bg-cyan"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
    </section>
  );
}
