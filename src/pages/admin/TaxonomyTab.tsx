import { useState } from "react";
import { Plus, X } from "lucide-react";
import { useGames } from "../../hooks/useGames";
import { useCategories, usePlayModes } from "../../hooks/useTaxonomy";
import { categoriesStore, playModesStore } from "../../lib/taxonomyStores";
import SyncWarning from "../../components/admin/SyncWarning";

export default function TaxonomyTab() {
  const games = useGames();
  const categories = useCategories();
  const playModes = usePlayModes();
  const syncState = {
    configured: categoriesStore.getSyncState().configured && playModesStore.getSyncState().configured,
    remoteHealthy:
      categoriesStore.getSyncState().remoteHealthy && playModesStore.getSyncState().remoteHealthy,
    lastSyncError: categoriesStore.getSyncState().lastSyncError || playModesStore.getSyncState().lastSyncError,
  };

  const [newCategory, setNewCategory] = useState("");
  const [newPlayMode, setNewPlayMode] = useState("");
  const [error, setError] = useState("");

  async function handleAddCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!newCategory.trim()) return;
    setError("");
    try {
      await categoriesStore.add({ name: newCategory.trim() });
      setNewCategory("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add category.");
    }
  }

  async function handleAddPlayMode(e: React.FormEvent) {
    e.preventDefault();
    if (!newPlayMode.trim()) return;
    setError("");
    try {
      await playModesStore.add({ name: newPlayMode.trim() });
      setNewPlayMode("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add play mode.");
    }
  }

  async function handleDeleteCategory(id: string) {
    const inUse = games.some((g) => g.category === id);
    if (inUse && !confirm("Some games use this category. Delete anyway? Those games will show as uncategorized.")) {
      return;
    }
    setError("");
    try {
      await categoriesStore.remove(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete category.");
    }
  }

  async function handleDeletePlayMode(id: string) {
    const inUse = games.some((g) => g.playMode === id);
    if (inUse && !confirm("Some games use this play mode. Delete anyway? Those games will show as unset.")) {
      return;
    }
    setError("");
    try {
      await playModesStore.remove(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete play mode.");
    }
  }

  return (
    <div>
      <SyncWarning state={syncState} label="CATEGORIES" />
      <h2 className="font-heading text-lg font-bold text-white/80 mb-4">GAME CATEGORIES & PLAY MODES</h2>
      {error && <p className="mb-4 text-pink text-sm">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="glass rounded-2xl p-5 md:p-6">
          <h3 className="font-heading text-sm font-bold mb-4 text-cyan tracking-wide">CATEGORIES</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((c) => (
              <span
                key={c.id}
                className="flex items-center gap-1.5 rounded-full bg-white/5 border border-white/15 pl-3 pr-1.5 py-1 text-xs"
              >
                {c.name}
                <button
                  type="button"
                  onClick={() => handleDeleteCategory(c.id)}
                  aria-label={`Delete ${c.name}`}
                  className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-pink/20 hover:text-pink"
                >
                  <X size={11} />
                </button>
              </span>
            ))}
            {categories.length === 0 && <p className="text-white/40 text-xs">No categories yet.</p>}
          </div>
          <form onSubmit={handleAddCategory} className="flex gap-2">
            <input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="e.g. Adventure"
              className="flex-1 min-w-0 rounded-lg bg-white/5 border border-white/15 px-3 py-2 text-sm placeholder:text-white/30 focus:outline-none focus:border-cyan"
            />
            <button
              type="submit"
              className="shrink-0 rounded-lg bg-cyan/20 border border-cyan/40 px-3 text-cyan hover:bg-cyan/30"
              aria-label="Add category"
            >
              <Plus size={16} />
            </button>
          </form>
        </section>

        <section className="glass rounded-2xl p-5 md:p-6">
          <h3 className="font-heading text-sm font-bold mb-4 text-cyan tracking-wide">PLAY MODES</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {playModes.map((m) => (
              <span
                key={m.id}
                className="flex items-center gap-1.5 rounded-full bg-white/5 border border-white/15 pl-3 pr-1.5 py-1 text-xs"
              >
                {m.name}
                <button
                  type="button"
                  onClick={() => handleDeletePlayMode(m.id)}
                  aria-label={`Delete ${m.name}`}
                  className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-pink/20 hover:text-pink"
                >
                  <X size={11} />
                </button>
              </span>
            ))}
            {playModes.length === 0 && <p className="text-white/40 text-xs">No play modes yet.</p>}
          </div>
          <form onSubmit={handleAddPlayMode} className="flex gap-2">
            <input
              value={newPlayMode}
              onChange={(e) => setNewPlayMode(e.target.value)}
              placeholder="e.g. Co-op"
              className="flex-1 min-w-0 rounded-lg bg-white/5 border border-white/15 px-3 py-2 text-sm placeholder:text-white/30 focus:outline-none focus:border-cyan"
            />
            <button
              type="submit"
              className="shrink-0 rounded-lg bg-cyan/20 border border-cyan/40 px-3 text-cyan hover:bg-cyan/30"
              aria-label="Add play mode"
            >
              <Plus size={16} />
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
