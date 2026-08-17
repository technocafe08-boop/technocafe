import { createFirestoreStore } from "./firestoreStore";

export interface GalleryImage {
  id: string;
  url: string;
  publicId?: string;
  caption?: string;
  order?: number;
  [key: string]: unknown;
}

// No seed images — the gallery starts empty until the admin uploads photos.
const gallery = createFirestoreStore<GalleryImage>("gallery", []);

export const galleryStore = {
  getAll: () => gallery.getAll(),
  getById: (id: string) => gallery.getById(id),
  isReady: () => gallery.isReady(),
  getSyncState: () => gallery.getSyncState(),
  add: (image: Omit<GalleryImage, "id" | "order">, explicitId?: string) => gallery.add(image, explicitId),
  update: (id: string, updates: Partial<Omit<GalleryImage, "id">>) => gallery.update(id, updates),
  remove: (id: string) => gallery.remove(id),
  reorder: (orderedIds: string[]) => gallery.reorder(orderedIds),
  subscribe: (listener: () => void) => gallery.subscribe(listener),
};
