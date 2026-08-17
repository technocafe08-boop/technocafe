import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import type { Game } from "../data/games";
import TiltCard from "./TiltCard";

export default function GameCard({
  game,
  index,
  onSelect,
}: {
  game: Game;
  index: number;
  onSelect: (game: Game) => void;
}) {
  const badgeText =
    game.installBadgeText && game.installBadgeText !== "AVAILABLE ON REQUEST"
      ? game.installBadgeText
      : "ON REQUEST";

  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.06 }}
    >
      <TiltCard className="h-full">
        <button
          type="button"
          onClick={() => onSelect(game)}
          data-cursor-hover
          className="group relative flex h-full w-full flex-col overflow-hidden rounded-[2.2rem] border border-white/15 bg-[#121318] text-left shadow-[0_25px_60px_rgba(0,0,0,0.6)] transition-all duration-300 hover:border-cyan/40"
        >
          {/* Main Top / Hero Card Body */}
          <div className="relative flex flex-1 flex-col p-5 pb-0 min-h-[24rem] bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.09)_0%,_rgba(25,27,34,0.95)_60%,_#121318_100%)]">
            
            {/* Top Header: Badges & Sub-caption */}
            <div className="relative z-10 flex items-start justify-between gap-2">
              {/* Left Badge + Sub-caption */}
              <div className="flex flex-col items-start gap-2 max-w-[60%]">
                <div className="inline-flex items-center gap-1.5 rounded-[0.85rem] border border-white/20 bg-[#1a1b22]/90 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md shadow-md">
                  <div className="grid h-4 w-4 place-items-center rounded-full border border-white/50 text-[10px] font-bold text-white leading-none">
                    i
                  </div>
                  <span className="tracking-wide uppercase text-[11px]">{game.needsInstall ? badgeText : "READY TO PLAY"}</span>
                </div>
                <p className="text-[10.5px] text-white/50 leading-tight font-normal">
                  {game.needsInstall
                    ? "Custom pricing based on your session duration and preferences."
                    : "Instant access on all gaming setups with full specs."}
                </p>
              </div>

              {/* Right Price Badge */}
              <div className="inline-flex items-baseline gap-1 rounded-[0.85rem] border-2 border-[#00c2ff] bg-[#071320] px-3.5 py-1.5 shadow-[0_0_18px_rgba(0,194,255,0.35)] backdrop-blur-md shrink-0">
                <span className="text-xs font-medium text-[#00c2ff]">Rs.</span>
                <span className="text-xl md:text-2xl font-black italic tracking-tighter text-[#00c2ff] leading-none">
                  {game.pricePerHour}
                </span>
                <span className="text-[11px] font-normal text-[#00c2ff]">/hr</span>
              </div>
            </div>

            {/* Game Cover Image */}
            <div className="relative z-10 flex flex-1 items-center justify-center py-4 my-auto">
              <img
                src={game.image}
                alt={game.name}
                loading="lazy"
                className="relative z-10 max-h-[16rem] w-auto max-w-[92%] object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.6)] transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#121318] to-transparent pointer-events-none" />
          </div>

          {/* Bottom Card Footer */}
          <div className="relative z-10 bg-[#121318] px-6 pb-6 pt-2">
            <h3 className="font-heading text-2xl md:text-3xl font-bold text-white tracking-tight truncate">
              {game.name}
            </h3>
            <p className="mt-1 flex items-center gap-1 text-sm text-white/50 group-hover:text-cyan transition-colors">
              Tap for details <ChevronRight size={16} className="text-[#00c2ff] transition-transform duration-300 group-hover:translate-x-1" />
            </p>
          </div>
        </button>
      </TiltCard>
    </motion.div>
  );
}
