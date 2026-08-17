import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { stats } from "../data/content";

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1600;
    const start = performance.now();

    function tick(now: number) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.floor(eased * value));
      if (t < 1) requestAnimationFrame(tick);
      else setDisplay(value);
    }
    requestAnimationFrame(tick);
  }, [inView, value]);

  return (
    <span ref={ref} className="font-heading text-4xl md:text-6xl font-black gradient-text">
      {display}
      {suffix}
    </span>
  );
}

export default function Stats() {
  return (
    <section id="stats" className="relative py-20 md:py-28 px-5 md:px-10 bg-bg">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6 text-center">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Counter value={s.value} suffix={s.suffix} />
            <p className="mt-2 text-white/60 text-xs md:text-sm font-body tracking-wide uppercase">
              {s.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
