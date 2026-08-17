export interface Category {
  id: string;
  name: string;
  order?: number;
  [key: string]: unknown;
}

export interface PlayMode {
  id: string;
  name: string;
  order?: number;
  [key: string]: unknown;
}

// "All Games" is a UI-level pseudo filter, not stored as a real category.
export const defaultCategories: Category[] = [
  { id: "fps", name: "FPS" },
  { id: "sports", name: "Sports" },
  { id: "action-adventure", name: "Action-Adventure" },
  { id: "battle-royale", name: "Battle Royale" },
  { id: "racing", name: "Racing" },
];

export const defaultPlayModes: PlayMode[] = [
  { id: "single-player", name: "Single Player" },
  { id: "multiplayer", name: "Multiplayer" },
];
