import { createFirestoreStore } from "./firestoreStore";
import { defaultCategories, defaultPlayModes, type Category, type PlayMode } from "../data/taxonomy";

export const categoriesStore = createFirestoreStore<Category>("categories", defaultCategories);
export const playModesStore = createFirestoreStore<PlayMode>("playModes", defaultPlayModes);

export const taxonomySync = {
  categories: () => categoriesStore.getSyncState(),
  playModes: () => playModesStore.getSyncState(),
};
