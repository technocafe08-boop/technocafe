import { motion } from "framer-motion";
import { useUpcomingGames } from "../hooks/useUpcomingGames";

export default function UpcomingGames() {
  const games = useUpcomingGames();

  return (
    <section id="upcoming-games" className="relative py-14 md:py-28 px-5 md:px-10 bg-bg overflow-hidden">
      <motion.div
        className="max-w-6xl mx-auto mb-6 md:mb-10"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-heading text-3xl md:text-5xl font-bold gradient-text">
              UPCOMING GAMES
            </h2>
            <p className="mt-3 text-white/60 font-body text-sm md:text-base">
              New titles will appear here first.
            </p>
          </div>
          <span className="hidden md:inline-flex rounded-full glass px-3 py-1 text-[11px] font-heading tracking-[0.18em] text-white/50">
            SCROLL HORIZONTALLY
          </span>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto">
        <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:bg-white/15 [&::-webkit-scrollbar-track]:bg-white/5">
          {games.length === 0 ? (
            <div className="shrink-0 w-[170px] sm:w-[190px] aspect-square rounded-2xl border border-dashed border-white/20 bg-white/5 flex items-center justify-center text-center px-4 text-white/35 text-sm font-body">
              Add upcoming games from the admin panel
            </div>
          ) : (
            games.map((game) => (
              <motion.article
                key={game.id}
                className="group shrink-0 w-[170px] sm:w-[190px] aspect-square rounded-2xl overflow-hidden glass rgb-border snap-start relative"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45 }}
              >
                <img src={game.image} alt={game.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-cyan/90">Coming soon</p>
                  <h3 className="mt-1 font-heading text-sm sm:text-base font-bold text-white leading-tight">
                    {game.title}
                  </h3>
                </div>
              </motion.article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
