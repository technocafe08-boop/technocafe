export interface Game {
  id: string;
  name: string;
  image: string;
  /** Cloudinary public id for the image, if uploaded via the admin panel. */
  imagePublicId?: string;
  pricePerHour: number;
  description: string;
  trailerUrl: string;
  /** Category id (from categoriesStore), e.g. "fps", "sports". Empty string = uncategorized. */
  category: string;
  /** Play mode id (from playModesStore), e.g. "single-player", "multiplayer". Empty string = unset. */
  playMode: string;
  /** Show an "install / setup" badge on the card, e.g. for games only on a pendrive. */
  needsInstall?: boolean;
  /** Custom badge text shown when needsInstall is true. Defaults to "AVAILABLE ON REQUEST". */
  installBadgeText?: string;
  order?: number;
  [key: string]: unknown;
}

// Seed library — shown until the admin adds/edits games from the Admin Panel.
// Images are royalty-free Unsplash placeholders; swap via the Admin Panel any time.
export const defaultGames: Game[] = [
  {
    id: "valorant",
    name: "Valorant",
    image:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=800&fit=crop",
    pricePerHour: 80,
    description:
      "A 5v5 tactical shooter where precise gunplay meets unique agent abilities. Lock in, plant the spike, and outsmart the enemy team round after round.",
    trailerUrl: "https://www.youtube.com/watch?v=e_E9W2vsRbQ",
    category: "fps",
    playMode: "multiplayer",
  },
  {
    id: "fifa25",
    name: "EA Sports FC 25",
    image:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=800&fit=crop",
    pricePerHour: 70,
    description:
      "The latest football simulation with hyper-realistic gameplay. Build your Ultimate Team or go head-to-head with a friend on the next PC over.",
    trailerUrl: "https://www.youtube.com/watch?v=scNfG-cvUsg",
    category: "sports",
    playMode: "multiplayer",
  },
  {
    id: "gta5",
    name: "GTA V",
    image:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=800&fit=crop",
    pricePerHour: 60,
    description:
      "Explore Los Santos in this open-world classic. Cause chaos solo or squad up for heists in GTA Online with the whole crew.",
    trailerUrl: "https://www.youtube.com/watch?v=QkkoHAzjnUs",
    category: "action-adventure",
    playMode: "single-player",
    needsInstall: true,
    installBadgeText: "AVAILABLE ON REQUEST",
  },
  {
    id: "csgo2",
    name: "Counter-Strike 2",
    image:
      "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=600&h=800&fit=crop",
    pricePerHour: 80,
    description:
      "The definitive competitive FPS, rebuilt on Source 2. Sharp shooting, smoke lineups, and clutch 1v5s — the café's ranked favorite.",
    trailerUrl: "https://www.youtube.com/watch?v=IHiRmLmyN3g",
    category: "fps",
    playMode: "multiplayer",
  },
  {
    id: "fortnite",
    name: "Fortnite",
    image:
      "https://images.unsplash.com/photo-1589241062272-c0a000072dfa?w=600&h=800&fit=crop",
    pricePerHour: 60,
    description:
      "Drop in, build up, and fight to be the last one standing in this ever-evolving battle royale, or explore the latest crossover mode.",
    trailerUrl: "https://www.youtube.com/watch?v=2gaKZoOB4Bo",
    category: "battle-royale",
    playMode: "multiplayer",
  },
  {
    id: "apexlegends",
    name: "Apex Legends",
    image:
      "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&h=800&fit=crop",
    pricePerHour: 70,
    description:
      "Fast-paced hero-shooter battle royale. Pick a legend, ping your squad, and fight for the crown in the Apex Games.",
    trailerUrl: "https://www.youtube.com/watch?v=innmNewjkuk",
    category: "battle-royale",
    playMode: "multiplayer",
    needsInstall: true,
    installBadgeText: "AVAILABLE ON REQUEST",
  },
];
