import { createFirestoreStore } from "./firestoreStore";
import { defaultGames, type Game } from "../data/games";

const store = createFirestoreStore<Game>("games", defaultGames);

export const gamesStore = {
  getAll: () => store.getAll(),
  getById: (id: string) => store.getById(id),
  isReady: () => store.isReady(),
  getSyncState: () => store.getSyncState(),
  add: (game: Omit<Game, "id" | "order">, explicitId?: string) => store.add(game, explicitId),
  update: (id: string, updates: Partial<Omit<Game, "id">>) => store.update(id, updates),
  remove: (id: string) => store.remove(id),
  subscribe: (listener: () => void) => store.subscribe(listener),
};
