import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useGallery } from "../../hooks/useGallery";
import { galleryStore } from "../../lib/galleryStore";
import ImageCropUpload from "../../components/admin/ImageCropUpload";
import SyncWarning from "../../components/admin/SyncWarning";

export default function GalleryTab() {
  const images = useGallery();
  const [caption, setCaption] = useState("");
  const [error, setError] = useState("");
  const syncState = galleryStore.getSyncState();

  async function handleUploaded(result: { url: string; publicId: string }) {
    setError("");
    try {
      await galleryStore.add(
        { url: result.url, publicId: result.publicId, caption: caption.trim() || undefined },
        `img-${Date.now()}`
      );
      setCaption("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save photo to library.");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this photo from the gallery?")) return;
    setError("");
    try {
      await galleryStore.remove(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete photo.");
    }
  }

  return (
    <div>
      <SyncWarning state={syncState} label="GALLERY" />
      <h2 className="font-heading text-lg font-bold text-white/80 mb-4">GALLERY ({images.length})</h2>

      <div className="glass rgb-border rounded-2xl p-6 md:p-8">
        <h3 className="font-heading text-base font-bold mb-1 text-cyan">ADD PHOTO</h3>
        <p className="text-white/40 text-xs mb-5">
          You can add as many photos as you like. Every photo is cropped to the same 4:5
          portrait shape — the size that reads best on a phone screen — so the grid stays neat.
        </p>

        <label className="flex flex-col gap-1.5 text-sm mb-4">
          Caption (optional)
          <input
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="e.g. Tournament Finals"
            className="rounded-lg bg-white/5 border border-white/15 px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-cyan"
          />
        </label>

        <ImageCropUpload
          label="Photo"
          aspect={4 / 5}
          outWidth={900}
          outHeight={1125}
          onUploaded={handleUploaded}
        />

        {error && <p className="mt-4 text-pink text-sm">{error}</p>}
      </div>

      <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((img) => (
          <div key={img.id} className="relative rounded-xl overflow-hidden glass aspect-[4/5] group">
            <img src={img.url} alt={img.caption || ""} className="w-full h-full object-cover" />
            {img.caption && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                <span className="text-white text-[11px] font-body">{img.caption}</span>
              </div>
            )}
            <button
              type="button"
              onClick={() => handleDelete(img.id)}
              aria-label="Delete photo"
              className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-black/60 text-white/80 hover:text-pink opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        {images.length === 0 && (
          <p className="col-span-full text-white/40 text-sm text-center py-6">
            No photos yet — upload your first one above.
          </p>
        )}
      </div>
    </div>
  );
}
