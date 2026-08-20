import { useEffect, useState } from "react";
import { upcomingGamesStore } from "../lib/upcomingGamesStore";
import type { UpcomingGame } from "../data/upcomingGames";

export function useUpcomingGames(): UpcomingGame[] {
  const [items, setItems] = useState<UpcomingGame[]>(upcomingGamesStore.getAll());
  useEffect(() => upcomingGamesStore.subscribe(() => setItems(upcomingGamesStore.getAll())), []);
  return items;
}
