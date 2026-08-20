import { motion } from "framer-motion";
import { Megaphone } from "lucide-react";

type AnnouncementBarProps = {
  text: string;
};

export default function AnnouncementBar({ text }: AnnouncementBarProps) {
  const message = text.trim();

  if (!message) return null;

  return (
    <motion.div
      className="relative z-10 w-full px-3 md:px-10"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      role="status"
      aria-live="polite"
    >
      <div className="glass rgb-border rounded-2xl overflow-hidden">
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3 md:px-5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cyan/15 text-cyan neon-box-cyan">
            <Megaphone size={16} />
          </span>
          <p className="text-xs uppercase tracking-[0.28em] text-white/50 font-heading">
            Announcement
          </p>
        </div>

        <div className="overflow-hidden px-4 py-3 md:px-5 md:py-4">
          <div className="announcement-marquee">
            <div className="announcement-track">
              <span className="announcement-copy text-sm md:text-[15px] leading-snug text-white/90 font-body">
                {message}
              </span>
              <span className="announcement-copy text-sm md:text-[15px] leading-snug text-white/90 font-body" aria-hidden="true">
                {message}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
