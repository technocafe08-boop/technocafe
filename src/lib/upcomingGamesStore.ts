import { createFirestoreStore } from "./firestoreStore";
import { defaultUpcomingGames, type UpcomingGame } from "../data/upcomingGames";

const upcomingGames = createFirestoreStore<UpcomingGame>("upcomingGames", defaultUpcomingGames);

export const upcomingGamesStore = {
  getAll: () => upcomingGames.getAll(),
  getById: (id: string) => upcomingGames.getById(id),
  isReady: () => upcomingGames.isReady(),
  getSyncState: () => upcomingGames.getSyncState(),
  add: (item: Omit<UpcomingGame, "id" | "order">, explicitId?: string) => upcomingGames.add(item, explicitId),
  update: (id: string, updates: Partial<Omit<UpcomingGame, "id">>) => upcomingGames.update(id, updates),
  remove: (id: string) => upcomingGames.remove(id),
  reorder: (orderedIds: string[]) => upcomingGames.reorder(orderedIds),
  subscribe: (listener: () => void) => upcomingGames.subscribe(listener),
};
