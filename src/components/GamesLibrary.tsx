import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGames } from "../hooks/useGames";
import { useCategories, usePlayModes } from "../hooks/useTaxonomy";
import type { Game } from "../data/games";
import GameCard from "./GameCard";
import GameModal from "./GameModal";
import { ChevronDown, ArrowUpDown } from "lucide-react";

const ALL = "all";
const MOBILE_LIMIT = 5;

type SortOption = "default" | "price-asc" | "price-desc";

const SORT_LABELS: Record<SortOption, string> = {
  default: "Default",
  "price-asc": "Price: Low → High",
  "price-desc": "Price: High → Low",
};

export default function GamesLibrary() {
  const games = useGames();
  const categories = useCategories();
  const playModes = usePlayModes();
  const [activeCategory, setActiveCategory] = useState<string>(ALL);
  const [activeMode, setActiveMode] = useState<string>(ALL);
  const [sort, setSort] = useState<SortOption>("default");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [selected, setSelected] = useState<Game | null>(null);

  const filtered = useMemo(() => {
    let list = games.filter((g) => {
      const matchesCategory = activeCategory === ALL || g.category === activeCategory;
      const matchesMode = activeMode === ALL || g.playMode === activeMode;
      return matchesCategory && matchesMode;
    });
    if (sort === "price-asc") list = [...list].sort((a, b) => a.pricePerHour - b.pricePerHour);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.pricePerHour - a.pricePerHour);
    return list;
  }, [games, activeCategory, activeMode, sort]);

  function handleCategoryChange(id: string) {
    setActiveCategory(id);
    setShowAll(false);
  }
  function handleModeChange(id: string) {
    setActiveMode(id);
    setShowAll(false);
  }
  function handleSortChange(s: SortOption) {
    setSort(s);
    setShowSortMenu(false);
    setShowAll(false);
  }

  const usedCategoryIds = new Set(games.map((g) => g.category).filter(Boolean));
  const visibleCategories = categories.filter((c) => usedCategoryIds.has(c.id));

  const usedModeIds = new Set(games.map((g) => g.playMode).filter(Boolean));
  const visibleModes = playModes.filter((m) => usedModeIds.has(m.id));

  // On mobile show only MOBILE_LIMIT unless expanded
  const displayedGames =
    !showAll && filtered.length > MOBILE_LIMIT
      ? filtered.slice(0, MOBILE_LIMIT)
      : filtered;

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

      {/* ROW 1 — Category filter pills (full width, scrollable) */}
      <div className="max-w-6xl mx-auto mb-3 flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
        <FilterPill
          label="All Games"
          active={activeCategory === ALL}
          onClick={() => handleCategoryChange(ALL)}
        />
        {visibleCategories.map((c) => (
          <FilterPill
            key={c.id}
            label={c.name}
            active={activeCategory === c.id}
            onClick={() => handleCategoryChange(c.id)}
          />
        ))}
      </div>

      {/* ROW 2 — Play mode pills (full width, scrollable) */}
      {visibleModes.length > 0 && (
        <div className="max-w-6xl mx-auto mb-3 flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
          <FilterPill
            small
            label="All Modes"
            active={activeMode === ALL}
            onClick={() => handleModeChange(ALL)}
          />
          {visibleModes.map((m) => (
            <FilterPill
              key={m.id}
              small
              label={m.name}
              active={activeMode === m.id}
              onClick={() => handleModeChange(m.id)}
            />
          ))}
        </div>
      )}

      {/* ROW 3 — Sort button (full width row, button on the right) */}
      <div className="max-w-6xl mx-auto mb-10 md:mb-14 flex items-center justify-end">
        <div className="relative">
          <button
            onClick={() => setShowSortMenu((v) => !v)}
            data-cursor-hover
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-xs font-heading tracking-wide transition-all ${
              sort !== "default"
                ? "bg-gradient-to-r from-purple to-pink text-black"
                : "glass text-white/60 hover:text-white"
            }`}
          >
            <ArrowUpDown size={12} />
            {sort === "default" ? "Sort by Price" : SORT_LABELS[sort]}
          </button>

          <AnimatePresence>
            {showSortMenu && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 z-50 glass rounded-2xl p-2 min-w-[180px] shadow-2xl shadow-black/50 border border-white/10"
              >
                {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => handleSortChange(key)}
                    className={`w-full text-left rounded-xl px-4 py-2.5 text-xs font-heading tracking-wide transition-colors ${
                      sort === key
                        ? "text-cyan bg-cyan/10"
                        : "text-white/70 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {SORT_LABELS[key]}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Click outside overlay to close sort menu */}
      {showSortMenu && (
        <div className="fixed inset-0 z-40" onClick={() => setShowSortMenu(false)} />
      )}

      {/* Active sort badge */}
      {sort !== "default" && (
        <div className="max-w-6xl mx-auto -mt-6 mb-6 flex items-center gap-2">
          <span className="text-xs text-white/40 font-body">Sorted by:</span>
          <span className="text-xs font-heading text-purple">{SORT_LABELS[sort]}</span>
          <button
            onClick={() => handleSortChange("default")}
            className="text-xs text-white/30 hover:text-white/70 transition-colors font-body underline"
          >
            clear
          </button>
        </div>
      )}

      {/* Games grid */}
      {filtered.length === 0 ? (
        <p className="text-center text-white/50 font-body">No games match this filter yet.</p>
      ) : (
        <>
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6 xl:gap-7">
            {displayedGames.map((game, i) => (
              <GameCard key={game.id} game={game} index={i} onSelect={setSelected} />
            ))}
          </div>

          {/* See All / Show Less — mobile only */}
          {filtered.length > MOBILE_LIMIT && (
            <motion.div
              className="mt-10 flex justify-center sm:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {!showAll ? (
                <button
                  onClick={() => setShowAll(true)}
                  data-cursor-hover
                  className="flex items-center gap-2 rounded-full px-7 py-3 font-heading text-sm tracking-[0.18em] text-black bg-gradient-to-r from-cyan to-purple neon-box-cyan shadow-lg active:scale-95 transition-transform"
                >
                  <ChevronDown size={16} />
                  See All {filtered.length} Games
                </button>
              ) : (
                <button
                  onClick={() => setShowAll(false)}
                  data-cursor-hover
                  className="flex items-center gap-2 rounded-full px-7 py-3 font-heading text-sm tracking-[0.18em] glass text-white/70 hover:text-white border border-white/10 transition-colors"
                >
                  Show Less
                </button>
              )}
            </motion.div>
          )}
        </>
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
