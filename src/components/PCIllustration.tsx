import { motion } from "framer-motion";
import pcCustom from "../assets/pc-custom.png";

export default function PCIllustration() {
  return (
    <div className="relative w-full max-w-[280px] md:max-w-md mx-auto aspect-[4/3] md:aspect-square flex items-center justify-center">
      {/* Glow blobs — blue + green */}
      <motion.div
        className="absolute w-44 h-44 md:w-72 md:h-72 rounded-full bg-cyan/25 blur-[80px]"
        style={{ left: "8%", top: "10%" }}
        animate={{ opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-44 h-44 md:w-72 md:h-72 rounded-full bg-purple/25 blur-[80px]"
        style={{ right: "6%", bottom: "8%" }}
        animate={{ opacity: [0.9, 0.5, 0.9] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.img
        src={pcCustom}
        alt="Custom Gaming PC Build"
        className="relative z-10 w-[82%] h-auto object-contain drop-shadow-[0_20px_50px_rgba(0,194,255,0.35)] select-none"
        draggable={false}
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
