export interface Setup {
  emoji: string;
  title: string;
  accent: string;
  features: string[];
  upcoming?: boolean;
}

export const setups: Setup[] = [
  {
    emoji: "🎮",
    title: "High-End Gaming PCs",
    accent: "cyan",
    features: ["RTX Graphics", "240Hz Monitor", "Mechanical Keyboard"],
  },
  {
    emoji: "🎧",
    title: "Xbox Series Arena",
    accent: "purple",
    features: ["Xbox Wireless Controllers", "4K TV", "Multiplayer Ready"],
    upcoming: true,
  },
  {
    emoji: "☕",
    title: "Cafe Zone",
    accent: "pink",
    features: ["Fresh Coffee", "Cold Drinks", "Snacks & Combos"],
  },
];

export const stats = [
  { value: 100, suffix: "+", label: "Daily Gamers" },
  { value: 20, suffix: "+", label: "Gaming PCs" },
  { value: 1000, suffix: "+", label: "Happy Customers" },
  { value: 15, suffix: "+", label: "Games in Library" },
];

export const whyChooseUs = [
  { title: "Latest Games", icon: "Tag" },
  { title: "Ultra Fast Internet", icon: "Wifi" },
  { title: "High End Gameing PC", icon: "Armchair" },
  { title: "Friendly Atmosphere", icon: "Snowflake" },
  { title: "Premium Peripherals", icon: "Mouse" },
];


