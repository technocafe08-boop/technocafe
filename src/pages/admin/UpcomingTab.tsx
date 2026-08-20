import { useState } from "react";
import { Trash2 } from "lucide-react";
import ImageCropUpload from "../../components/admin/ImageCropUpload";
import SyncWarning from "../../components/admin/SyncWarning";
import { useUpcomingGames } from "../../hooks/useUpcomingGames";
import { upcomingGamesStore } from "../../lib/upcomingGamesStore";

export default function UpcomingTab() {
  const games = useUpcomingGames();
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const syncState = upcomingGamesStore.getSyncState();

  async function handleUploaded(result: { url: string; publicId: string }) {
    if (!title.trim()) {
      setError("Title is required before uploading.");
      return;
    }
    setError("");
    try {
      await upcomingGamesStore.add(
        { title: title.trim(), image: result.url, imagePublicId: result.publicId },
        `upcoming-${Date.now()}`
      );
      setTitle("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save upcoming game.");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this upcoming game?")) return;
    setError("");
    try {
      await upcomingGamesStore.remove(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete upcoming game.");
    }
  }

  return (
    <div>
      <SyncWarning state={syncState} label="UPCOMING GAMES" />
      <h2 className="font-heading text-lg font-bold text-white/80 mb-4">UPCOMING GAMES ({games.length})</h2>

      <div className="glass rgb-border rounded-2xl p-6 md:p-8">
        <h3 className="font-heading text-base font-bold mb-1 text-cyan">ADD UPCOMING GAME</h3>
        <p className="text-white/40 text-xs mb-5">
          Add a title and a square image. Cards render as compact 4x4 tiles in the horizontal row on the homepage.
        </p>

        <label className="flex flex-col gap-1.5 text-sm mb-4">
          Title
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Spider-Man 2"
            className="rounded-lg bg-white/5 border border-white/15 px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-cyan"
          />
        </label>

        <ImageCropUpload
          label="Image"
          aspect={1}
          outWidth={800}
          outHeight={800}
          onUploaded={handleUploaded}
          hint="Square crop works best for the upcoming games strip."
        />

        {error && <p className="mt-4 text-pink text-sm">{error}</p>}
      </div>

      <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {games.map((game) => (
          <div key={game.id} className="relative rounded-2xl overflow-hidden glass aspect-square group">
            <img src={game.image} alt={game.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-cyan/90">Upcoming</p>
              <h3 className="mt-1 text-white text-sm font-heading font-bold leading-tight">{game.title}</h3>
            </div>
            <button
              type="button"
              onClick={() => handleDelete(game.id)}
              aria-label={`Delete ${game.title}`}
              className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-black/60 text-white/80 hover:text-pink opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        {games.length === 0 && (
          <p className="col-span-full text-white/40 text-sm text-center py-6">
            No upcoming games yet - add the first one above.
          </p>
        )}
      </div>
    </div>
  );
}
