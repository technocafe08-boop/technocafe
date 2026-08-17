import { motion } from "framer-motion";
import { setups } from "../data/content";
import TiltCard from "./TiltCard";

const ACCENTS: Record<string, string> = {
  cyan: "text-cyan neon-box-cyan",
  purple: "text-purple neon-box-purple",
  pink: "text-pink neon-box-pink",
};

export default function SetupShowcase() {
  return (
    <section id="setups" className="relative py-24 md:py-32 px-5 md:px-10 bg-bg overflow-hidden">
      <motion.div
        className="max-w-6xl mx-auto text-center mb-14 md:mb-20"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="font-heading text-3xl md:text-5xl font-bold gradient-text">
          GAMING SETUP SHOWCASE
        </h2>
        <p className="mt-3 text-white/60 font-body text-sm md:text-base">
          Everything you need for the ultimate session.
        </p>
      </motion.div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {setups.map((setup, i) => (
          <motion.div
            key={setup.title}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: i * 0.12 }}
          >
            <TiltCard className="relative rgb-border glass rounded-2xl p-7 md:p-8 h-full">
              {setup.upcoming && (
                <span className="absolute top-4 right-4 md:top-5 md:right-5 flex items-center gap-1.5 rounded-full bg-purple/15 border border-purple/40 px-3 py-1 text-[10px] md:text-xs font-heading tracking-[0.15em] text-purple">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple animate-pulse" />
                  COMING SOON
                </span>
              )}
              <div className="text-4xl md:text-5xl mb-4">{setup.emoji}</div>
              <h3 className={`font-heading text-lg md:text-xl font-bold mb-4 pr-20 ${ACCENTS[setup.accent]}`}>
                {setup.title}
              </h3>
              <ul className="space-y-2">
                {setup.features.map((f) => (
                  <li key={f} className="text-white/75 text-sm md:text-base font-body flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                    {f}
                  </li>
                ))}
              </ul>
              {setup.upcoming && (
                <p className="mt-4 text-white/40 text-xs font-body italic">
                  Launching soon at Techno Cafe — stay tuned.
                </p>
              )}
            </TiltCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
