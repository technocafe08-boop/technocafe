import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logoIcon from "../assets/logo-icon.png";

export default function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const start = performance.now();
    const duration = 1600;
    let raf: number;

    function tick(now: number) {
      const t = Math.min(1, (now - start) / duration);
      setProgress(Math.floor(t * 100));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setVisible(false);
          onDone();
        }, 250);
      }
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bg"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.img
            src={logoIcon}
            alt="Techno Cafe"
            className="h-24 xs:h-28 md:h-36 w-auto select-none"
            draggable={false}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          />
          <h1
            data-text="TECHNO CAFE"
            className="glitch font-heading text-2xl xs:text-3xl md:text-5xl font-black tracking-widest text-white mt-2"
          >
            TECHNO CAFE
          </h1>
          <p className="mt-4 text-cyan/80 font-body tracking-[0.3em] text-xs md:text-sm">
            LOADING{".".repeat((progress % 3) + 1)}
          </p>
          <div className="mt-8 w-56 md:w-72 h-[3px] bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple via-cyan to-pink"
              style={{ width: `${progress}%`, transition: "width 0.1s linear" }}
            />
          </div>
          <span className="mt-2 text-white/40 text-xs font-body">{progress}%</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
