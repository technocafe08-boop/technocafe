import { useEffect, useState } from "react";
import { gamesStore } from "../lib/gamesStore";
import type { Game } from "../data/games";

export function useGames(): Game[] {
  const [games, setGames] = useState<Game[]>(gamesStore.getAll());

  useEffect(() => {
    return gamesStore.subscribe(() => setGames(gamesStore.getAll()));
  }, []);

  return games;
}
