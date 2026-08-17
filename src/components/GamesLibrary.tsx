import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useGames } from "../hooks/useGames";
import { useCategories, usePlayModes } from "../hooks/useTaxonomy";
import type { Game } from "../data/games";
import GameCard from "./GameCard";
import GameModal from "./GameModal";

const ALL = "all";

export default function GamesLibrary() {
  const games = useGames();
  const categories = useCategories();
  const playModes = usePlayModes();
  const [activeCategory, setActiveCategory] = useState<string>(ALL);
  const [activeMode, setActiveMode] = useState<string>(ALL);
  const [selected, setSelected] = useState<Game | null>(null);

  const filtered = useMemo(() => {
    return games.filter((g) => {
      const matchesCategory = activeCategory === ALL || g.category === activeCategory;
      const matchesMode = activeMode === ALL || g.playMode === activeMode;
      return matchesCategory && matchesMode;
    });
  }, [games, activeCategory, activeMode]);

  // Only show category tabs that actually have at least one game, so admin-created
  // empty categories don't clutter the filter bar for players.
  const usedCategoryIds = new Set(games.map((g) => g.category).filter(Boolean));
  const visibleCategories = categories.filter((c) => usedCategoryIds.has(c.id));

  const usedModeIds = new Set(games.map((g) => g.playMode).filter(Boolean));
  const visibleModes = playModes.filter((m) => usedModeIds.has(m.id));

  return (
    <section id="games" className="relative py-24 md:py-32 px-5 md:px-10 bg-bg overflow-hidden">
      <motion.div
        className="max-w-6xl mx-auto text-center mb-10 md:mb-14"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="font-heading text-3xl md:text-5xl font-bold gradient-text">
          GAME LIBRARY
        </h2>
        <p className="mt-3 text-white/60 font-body text-sm md:text-base">
          Tap a title for details, pricing, and the trailer.
        </p>
      </motion.div>

      <div className="max-w-6xl mx-auto mb-4 flex gap-2 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden">
        <FilterPill
          label="All Games"
          active={activeCategory === ALL}
          onClick={() => setActiveCategory(ALL)}
        />
        {visibleCategories.map((c) => (
          <FilterPill
            key={c.id}
            label={c.name}
            active={activeCategory === c.id}
            onClick={() => setActiveCategory(c.id)}
          />
        ))}
      </div>

      {visibleModes.length > 0 && (
        <div className="max-w-6xl mx-auto mb-10 md:mb-14 flex gap-2 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden">
          <FilterPill
            small
            label="All Modes"
            active={activeMode === ALL}
            onClick={() => setActiveMode(ALL)}
          />
          {visibleModes.map((m) => (
            <FilterPill
              key={m.id}
              small
              label={m.name}
              active={activeMode === m.id}
              onClick={() => setActiveMode(m.id)}
            />
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-center text-white/50 font-body">No games match this filter yet.</p>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6 xl:gap-7">
          {filtered.map((game, i) => (
            <GameCard key={game.id} game={game} index={i} onSelect={setSelected} />
          ))}
        </div>
      )}

      <GameModal game={selected} onClose={() => setSelected(null)} />
    </section>
  );
}

function FilterPill({
  label,
  active,
  onClick,
  small,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  small?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      data-cursor-hover
      className={`shrink-0 whitespace-nowrap rounded-full font-heading tracking-wide transition-all ${
        small ? "px-3.5 py-1.5 text-[11px] md:text-xs" : "px-4 py-2 text-xs md:text-sm"
      } ${
        active
          ? "bg-gradient-to-r from-cyan to-purple text-black neon-box-cyan"
          : "glass text-white/60 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}
