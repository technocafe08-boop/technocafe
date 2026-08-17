import { motion } from "framer-motion";

export default function PCIllustration() {
  return (
    <div className="relative w-full max-w-md mx-auto aspect-square flex items-center justify-center">
      {/* Glow blobs — blue + green */}
      <motion.div
        className="absolute w-56 h-56 md:w-72 md:h-72 rounded-full bg-cyan/25 blur-[80px]"
        style={{ left: "8%", top: "10%" }}
        animate={{ opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-56 h-56 md:w-72 md:h-72 rounded-full bg-purple/25 blur-[80px]"
        style={{ right: "6%", bottom: "8%" }}
        animate={{ opacity: [0.9, 0.5, 0.9] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <svg
        viewBox="0 0 400 400"
        className="relative z-10 w-full h-full drop-shadow-[0_0_35px_rgba(0,194,255,0.25)]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="caseGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1a1a20" />
            <stop offset="100%" stopColor="#0a0a0c" />
          </linearGradient>
          <linearGradient id="glassGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--cyan)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="var(--purple)" stopOpacity="0.12" />
          </linearGradient>
        </defs>

        {/* PC tower */}
        <rect x="120" y="60" width="160" height="290" rx="14" fill="url(#caseGrad)" stroke="var(--cyan)" strokeOpacity="0.35" strokeWidth="1.5" />
        {/* Tempered glass side panel */}
        <rect x="136" y="80" width="128" height="180" rx="8" fill="url(#glassGrad)" stroke="var(--purple)" strokeOpacity="0.4" strokeWidth="1" />

        {/* RGB fans */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "200px 130px" }}
        >
          <circle cx="200" cy="130" r="26" fill="none" stroke="var(--cyan)" strokeWidth="2" />
          <circle cx="200" cy="130" r="26" fill="none" stroke="var(--cyan)" strokeWidth="2" strokeDasharray="4 10" opacity="0.7" />
        </motion.g>
        <motion.g
          animate={{ rotate: -360 }}
          transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "200px 205px" }}
        >
          <circle cx="200" cy="205" r="26" fill="none" stroke="var(--purple)" strokeWidth="2" />
          <circle cx="200" cy="205" r="26" fill="none" stroke="var(--purple)" strokeWidth="2" strokeDasharray="4 10" opacity="0.7" />
        </motion.g>

        {/* GPU */}
        <rect x="140" y="250" width="120" height="34" rx="6" fill="#111114" stroke="var(--cyan)" strokeOpacity="0.5" strokeWidth="1" />
        <circle cx="162" cy="267" r="9" fill="none" stroke="var(--purple)" strokeWidth="1.5" />
        <circle cx="196" cy="267" r="9" fill="none" stroke="var(--purple)" strokeWidth="1.5" />
        <rect x="252" y="256" width="4" height="22" fill="var(--cyan)" opacity="0.6" />

        {/* Front strip light */}
        <rect x="120" y="60" width="6" height="290" rx="3" fill="var(--cyan)" opacity="0.55" />

        {/* Power button */}
        <circle cx="200" cy="335" r="6" fill="var(--purple)" opacity="0.9" />

        {/* Base shadow */}
        <ellipse cx="200" cy="368" rx="90" ry="10" fill="#000" opacity="0.35" />
      </svg>
    </div>
  );
}
