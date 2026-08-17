import { useEffect, useState } from "react";
import { galleryStore, type GalleryImage } from "../lib/galleryStore";

export function useGallery(): GalleryImage[] {
  const [items, setItems] = useState<GalleryImage[]>(galleryStore.getAll());
  useEffect(() => galleryStore.subscribe(() => setItems(galleryStore.getAll())), []);
  return items;
}
