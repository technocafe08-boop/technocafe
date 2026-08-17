import { AnimatePresence, motion } from "framer-motion";

export default function EasterEggOverlay({
  active,
  label,
}: {
  active: boolean;
  label: string;
}) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="fixed inset-0 z-[95] pointer-events-none flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.6, 1, 0] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-pink/40 via-purple/40 to-cyan/40 mix-blend-screen" />
          <motion.h2
            className="font-heading text-3xl md:text-6xl font-black text-white neon-purple tracking-widest text-center px-6"
            initial={{ scale: 0.8 }}
            animate={{ scale: [0.8, 1.1, 1] }}
            transition={{ duration: 0.6 }}
          >
            {label}
          </motion.h2>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
