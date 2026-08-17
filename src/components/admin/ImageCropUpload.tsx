import { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import { UploadCloud, Check, X, Loader2 } from "lucide-react";
import { getCroppedImageBlob } from "../../lib/cropImage";
import { uploadToCloudinary } from "../../lib/cloudinary";

interface Props {
  label: string;
  /** width / height, e.g. 3/4 for portrait game art, 4/5 for gallery photos. */
  aspect: number;
  /** Output pixel size the cropped image is resized to before upload. */
  outWidth: number;
  outHeight: number;
  currentUrl?: string;
  onUploaded: (result: { url: string; publicId: string }) => void;
  hint?: string;
}

export default function ImageCropUpload({
  label,
  aspect,
  outWidth,
  outHeight,
  currentUrl,
  onUploaded,
  hint,
}: Props) {
  const [rawSrc, setRawSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError("");
    const reader = new FileReader();
    reader.onload = () => {
      setRawSrc(reader.result as string);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    };
    reader.readAsDataURL(file);
  }

  const onCropComplete = useCallback((_area: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  async function handleConfirm() {
    if (!rawSrc || !croppedAreaPixels) return;
    setUploading(true);
    setError("");
    try {
      const blob = await getCroppedImageBlob(rawSrc, croppedAreaPixels, outWidth, outHeight);
      const result = await uploadToCloudinary(blob);
      onUploaded(result);
      setRawSrc(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-1.5 text-sm">
      <span>{label}</span>
      {hint && <p className="text-white/40 text-xs -mt-1 mb-1">{hint}</p>}

      <div className="flex items-center gap-3">
        {currentUrl ? (
          <img
            src={currentUrl}
            alt=""
            className="w-16 h-16 rounded-lg object-cover shrink-0 border border-white/15"
          />
        ) : (
          <div className="w-16 h-16 rounded-lg shrink-0 border border-dashed border-white/20 flex items-center justify-center text-white/30">
            <UploadCloud size={18} />
          </div>
        )}
        <label className="flex items-center gap-2 rounded-lg bg-white/5 border border-white/15 px-3.5 py-2.5 text-sm text-white/80 cursor-pointer hover:border-cyan transition-colors">
          <UploadCloud size={15} />
          {currentUrl ? "Replace photo" : "Upload photo"}
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </label>
      </div>

      {rawSrc && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="w-full max-w-md glass rgb-border rounded-2xl overflow-hidden">
            <div className="relative h-[60vh] max-h-[420px] bg-black">
              <Cropper
                image={rawSrc}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="p-4 md:p-5">
              <label className="flex items-center gap-3 text-xs text-white/60">
                Zoom
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.01}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="flex-1 accent-cyan"
                />
              </label>

              {error && <p className="mt-3 text-pink text-xs">{error}</p>}

              <div className="mt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={uploading}
                  className="flex items-center gap-2 font-heading tracking-wide text-xs font-bold px-5 py-2.5 rounded-full text-black bg-gradient-to-r from-cyan to-purple neon-box-cyan disabled:opacity-60"
                >
                  {uploading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                  {uploading ? "Uploading…" : "Crop & Upload"}
                </button>
                <button
                  type="button"
                  onClick={() => setRawSrc(null)}
                  disabled={uploading}
                  className="flex items-center gap-1.5 text-white/50 hover:text-white text-xs px-3 py-2"
                >
                  <X size={14} />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
