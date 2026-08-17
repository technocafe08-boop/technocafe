import { useState } from "react";
import { motion } from "framer-motion";
import { Trash2, Pencil, Plus, RotateCcw } from "lucide-react";
import { useGames } from "../../hooks/useGames";
import { useCategories, usePlayModes } from "../../hooks/useTaxonomy";
import { gamesStore } from "../../lib/gamesStore";
import { defaultGames, type Game } from "../../data/games";
import MagneticButton from "../../components/MagneticButton";
import ImageCropUpload from "../../components/admin/ImageCropUpload";
import SyncWarning from "../../components/admin/SyncWarning";

type FormState = {
  name: string;
  image: string;
  imagePublicId: string;
  pricePerHour: string;
  description: string;
  trailerUrl: string;
  category: string;
  playMode: string;
  needsInstall: boolean;
  installBadgeText: string;
};

const EMPTY_FORM: FormState = {
  name: "",
  image: "",
  imagePublicId: "",
  pricePerHour: "",
  description: "",
  trailerUrl: "",
  category: "",
  playMode: "",
  needsInstall: false,
  installBadgeText: "AVAILABLE ON REQUEST",
};

export default function GamesTab() {
  const games = useGames();
  const categories = useCategories();
  const playModes = usePlayModes();
  const syncState = gamesStore.getSyncState();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function startEdit(game: Game) {
    setEditingId(game.id);
    setForm({
      name: game.name,
      image: game.image,
      imagePublicId: game.imagePublicId || "",
      pricePerHour: String(game.pricePerHour),
      description: game.description,
      trailerUrl: game.trailerUrl,
      category: game.category || "",
      playMode: game.playMode || "",
      needsInstall: !!game.needsInstall,
      installBadgeText: game.installBadgeText || "AVAILABLE ON REQUEST",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const price = Number(form.pricePerHour);

    if (!form.name.trim() || !form.image.trim() || !form.trailerUrl.trim() || !form.description.trim()) {
      setError("Name, photo, trailer link, and description are required.");
      return;
    }
    if (!Number.isFinite(price) || price <= 0) {
      setError("Price per hour must be a positive number.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      image: form.image.trim(),
      imagePublicId: form.imagePublicId.trim() || undefined,
      pricePerHour: price,
      description: form.description.trim(),
      trailerUrl: form.trailerUrl.trim(),
      category: form.category,
      playMode: form.playMode,
      needsInstall: form.needsInstall,
      installBadgeText: form.needsInstall ? form.installBadgeText.trim() || "AVAILABLE ON REQUEST" : undefined,
    };

    setSaving(true);
    setError("");
    try {
      if (editingId) {
        await gamesStore.update(editingId, payload);
      } else {
        await gamesStore.add(payload);
      }
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save — check your Firebase setup and try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this game?")) return;
    try {
      if (editingId === id) resetForm();
      await gamesStore.remove(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete game.");
    }
  }

  async function handleReset() {
    if (!confirm("Reset the game library to the default seed list? This can't be undone.")) return;
    try {
      await Promise.all(games.map((g) => gamesStore.remove(g.id)));
      await Promise.all(
        defaultGames.map((g) => {
          const { id, ...rest } = g;
          return gamesStore.add(rest, id);
        })
      );
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset games.");
    }
  }

  return (
    <div>
      <SyncWarning state={syncState} label="GAMES" />
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading text-lg font-bold text-white/80">GAMES</h2>
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 text-white/40 hover:text-pink transition-colors text-xs"
        >
          <RotateCcw size={13} />
          Reset to defaults
        </button>
      </div>

      <motion.form
        onSubmit={handleSubmit}
        className="glass rgb-border rounded-2xl p-6 md:p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h3 className="font-heading text-base font-bold mb-5 text-cyan">
          {editingId ? "EDIT GAME" : "ADD NEW GAME"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col gap-1.5 text-sm">
            Game name
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Valorant"
              className="rounded-lg bg-white/5 border border-white/15 px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-cyan"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            Price per hour (₹)
            <input
              value={form.pricePerHour}
              onChange={(e) => setForm((f) => ({ ...f, pricePerHour: e.target.value }))}
              placeholder="e.g. 80"
              inputMode="numeric"
              className="rounded-lg bg-white/5 border border-white/15 px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-cyan"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            Category
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="rounded-lg bg-white/5 border border-white/15 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan"
            >
              <option value="" className="bg-bg">Uncategorized</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id} className="bg-bg">
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            Play mode
            <select
              value={form.playMode}
              onChange={(e) => setForm((f) => ({ ...f, playMode: e.target.value }))}
              className="rounded-lg bg-white/5 border border-white/15 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan"
            >
              <option value="" className="bg-bg">Not set</option>
              {playModes.map((m) => (
                <option key={m.id} value={m.id} className="bg-bg">
                  {m.name}
                </option>
              ))}
            </select>
          </label>

          <div className="md:col-span-2">
            <ImageCropUpload
              label="Game cover photo"
              hint="Cropped to a 3:4 portrait card — the same shape shown on the site."
              aspect={3 / 4}
              outWidth={900}
              outHeight={1200}
              currentUrl={form.image || undefined}
              onUploaded={(r) => setForm((f) => ({ ...f, image: r.url, imagePublicId: r.publicId }))}
            />
          </div>

          <label className="flex flex-col gap-1.5 text-sm md:col-span-2">
            YouTube trailer URL
            <input
              value={form.trailerUrl}
              onChange={(e) => setForm((f) => ({ ...f, trailerUrl: e.target.value }))}
              placeholder="https://www.youtube.com/watch?v=..."
              className="rounded-lg bg-white/5 border border-white/15 px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-cyan"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm md:col-span-2">
            Description
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Short description shown when a player taps the game..."
              rows={3}
              className="rounded-lg bg-white/5 border border-white/15 px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-cyan resize-none"
            />
          </label>

          <div className="md:col-span-2 rounded-lg border border-white/10 bg-white/[0.03] p-4">
            <label className="flex items-center gap-2.5 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={form.needsInstall}
                onChange={(e) => setForm((f) => ({ ...f, needsInstall: e.target.checked }))}
                className="w-4 h-4 accent-cyan"
              />
              This game isn't installed on every PC yet (e.g. only on a pendrive) — show a badge
            </label>
            {form.needsInstall && (
              <input
                value={form.installBadgeText}
                onChange={(e) => setForm((f) => ({ ...f, installBadgeText: e.target.value }))}
                placeholder="AVAILABLE ON REQUEST"
                className="mt-3 w-full rounded-lg bg-white/5 border border-white/15 px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-cyan"
              />
            )}
          </div>
        </div>

        {error && <p className="mt-4 text-pink text-sm">{error}</p>}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <MagneticButton
            type="submit"
            className="flex items-center gap-2 font-heading tracking-[0.1em] text-sm font-bold px-6 py-3 rounded-full text-black bg-gradient-to-r from-cyan to-purple neon-box-cyan min-h-[44px] disabled:opacity-60"
          >
            <Plus size={16} />
            {saving ? "Saving…" : editingId ? "SAVE CHANGES" : "ADD GAME"}
          </MagneticButton>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-white/50 hover:text-white text-sm px-4 py-2"
            >
              Cancel
            </button>
          )}
        </div>
      </motion.form>

      <div className="mt-8">
        <h3 className="font-heading text-sm font-bold mb-4 text-white/60">LIBRARY ({games.length})</h3>
        <div className="space-y-3">
          {games.map((game) => {
            const categoryName = categories.find((c) => c.id === game.category)?.name;
            const modeName = playModes.find((m) => m.id === game.playMode)?.name;
            return (
              <div key={game.id} className="flex items-center gap-4 glass rounded-xl p-3 md:p-4">
                <img
                  src={game.image}
                  alt={game.name}
                  className="w-14 h-14 rounded-lg object-cover shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-heading text-sm font-bold text-white truncate">{game.name}</p>
                  <p className="text-white/50 text-xs">
                    ₹{game.pricePerHour}/hr
                    {categoryName && <> · {categoryName}</>}
                    {modeName && <> · {modeName}</>}
                    {game.needsInstall && <> · {game.installBadgeText || "AVAILABLE ON REQUEST"}</>}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => startEdit(game)}
                  aria-label={`Edit ${game.name}`}
                  className="w-9 h-9 flex items-center justify-center rounded-full glass text-white/70 hover:text-cyan shrink-0"
                >
                  <Pencil size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(game.id)}
                  aria-label={`Delete ${game.name}`}
                  className="w-9 h-9 flex items-center justify-center rounded-full glass text-white/70 hover:text-pink shrink-0"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            );
          })}
          {games.length === 0 && (
            <p className="text-white/40 text-sm text-center py-6">No games yet — add your first one above.</p>
          )}
        </div>
      </div>
    </div>
  );
}
