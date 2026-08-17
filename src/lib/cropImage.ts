export interface PixelCrop {
  x: number;
  y: number;
  width: number;
  height: number;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/** Crops `src` to `crop` (in source-image pixels) and resizes to `outWidth`x`outHeight`,
 * returning a JPEG Blob ready to upload. */
export async function getCroppedImageBlob(
  src: string,
  crop: PixelCrop,
  outWidth: number,
  outHeight: number
): Promise<Blob> {
  const img = await loadImage(src);
  const canvas = document.createElement("canvas");
  canvas.width = outWidth;
  canvas.height = outHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  ctx.drawImage(img, crop.x, crop.y, crop.width, crop.height, 0, 0, outWidth, outHeight);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Could not export cropped image"))),
      "image/jpeg",
      0.9
    );
  });
}
