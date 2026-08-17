import { AnimatePresence, motion } from "framer-motion";
import { X, PlayCircle, MessageCircle } from "lucide-react";
import type { Game } from "../data/games";
import MagneticButton from "./MagneticButton";
import { buildWhatsAppLink } from "../lib/settingsStore";

export default function GameModal({
  game,
  onClose,
}: {
  game: Game | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {game && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end md:items-center justify-center px-0 md:px-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

          <motion.div
            className="relative z-10 w-full md:max-w-lg glass rgb-border rounded-t-3xl md:rounded-3xl overflow-hidden max-h-[88vh] overflow-y-auto"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              aria-label="Close"
              onClick={onClose}
              data-cursor-hover
              className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full glass text-white/80 hover:text-cyan"
            >
              <X size={20} />
            </button>

            <div className="relative aspect-video md:aspect-[16/10]">
              <img src={game.image} alt={game.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />
            </div>

            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-heading text-xl md:text-2xl font-bold text-white">
                  {game.name}
                </h3>
                <span className="shrink-0 font-heading text-sm md:text-base text-cyan neon-cyan whitespace-nowrap">
                  ₹{game.pricePerHour}/hr
                </span>
              </div>

              <p className="mt-4 text-white/70 text-sm md:text-base font-body leading-relaxed">
                {game.description}
              </p>

              {game.needsInstall && (
                <div className="mt-4 rounded-xl border border-pink/40 bg-pink/10 px-4 py-3">
                  <p className="text-pink text-xs md:text-sm font-body">
                    <span className="font-heading tracking-wide">
                      {game.installBadgeText || "AVAILABLE ON REQUEST"}
                    </span>{" "}
                    — this one needs a quick install on your PC. Message the team and we'll set it up for you.
                  </p>
                </div>
              )}

              <div className="mt-7 flex flex-col xs:flex-row gap-3">
                <MagneticButton
                  onClick={() => window.open(game.trailerUrl, "_blank", "noopener,noreferrer")}
                  className="flex items-center justify-center gap-2 font-heading tracking-[0.15em] text-sm font-bold px-6 py-3.5 rounded-full text-black bg-gradient-to-r from-pink via-purple to-cyan neon-box-pink min-h-[48px] w-full"
                >
                  <PlayCircle size={18} />
                  WATCH TRAILER
                </MagneticButton>

                {game.needsInstall && (
                  <MagneticButton
                    onClick={() =>
                      window.open(
                        buildWhatsAppLink(
                          `Hi Techno Cafe! I'd like to play ${game.name} — can you install it on a PC for me?`
                        ),
                        "_blank",
                        "noopener,noreferrer"
                      )
                    }
                    className="flex items-center justify-center gap-2 font-heading tracking-[0.15em] text-sm font-bold px-6 py-3.5 rounded-full text-white glass border border-white/20 hover:border-cyan/60 min-h-[48px] w-full"
                  >
                    <MessageCircle size={18} />
                    CONNECT ON WHATSAPP
                  </MagneticButton>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
