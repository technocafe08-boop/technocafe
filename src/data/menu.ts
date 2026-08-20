export interface MenuCategory {
  id: string;
  name: string;
  emoji: string;
  order?: number;
  [key: string]: unknown;
}

export interface MenuSubCategory {
  id: string;
  name: string;
  categoryId: string;
  order?: number;
  [key: string]: unknown;
}

export interface MenuItem {
  id: string;
  name: string;
  price?: number;
  categoryId: string;
  /** Optional sub-category id (from defaultMenuSubCategories / admin-added ones). */
  subCategoryId?: string;
  order?: number;
  [key: string]: unknown;
}

export const defaultMenuCategories: MenuCategory[] = [
  { id: "maggi", name: "Maggi", emoji: "🍜" },
  { id: "sandwich", name: "Sandwich", emoji: "🥪" },
  { id: "quick-bites", name: "Quick Bites", emoji: "🍳" },
  { id: "pasta", name: "Pasta", emoji: "🍝" },
  { id: "hot-drinks", name: "Hot Drinks", emoji: "☕" },
  { id: "cold-drinks", name: "Cold Drinks", emoji: "🥤" },
  { id: "more", name: "More", emoji: "🍛" },
];

export const defaultMenuSubCategories: MenuSubCategory[] = [];

export const defaultMenuItems: MenuItem[] = [
  { id: "classic-masala-maggi", name: "Classic Masala Maggi", categoryId: "maggi" },
  { id: "veg-masala-maggi", name: "Veg Masala Maggi", categoryId: "maggi" },
  { id: "egg-maggi", name: "Egg Maggi", categoryId: "maggi" },
  { id: "cheese-maggi", name: "Cheese Maggi", categoryId: "maggi" },

  { id: "cheese-corn-sandwich", name: "Cheese Corn Sandwich", categoryId: "sandwich" },
  { id: "egg-mayo-sandwich", name: "Egg Mayo Sandwich", categoryId: "sandwich" },

  { id: "masala-omelette", name: "Masala Omelette", categoryId: "quick-bites" },
  { id: "cheese-omelette", name: "Cheese Omelette", categoryId: "quick-bites" },

  { id: "masala-pasta", name: "Masala Pasta", categoryId: "pasta" },
  { id: "egg-masala-pasta", name: "Egg Masala Pasta", categoryId: "pasta" },
  { id: "cheese-pasta", name: "Cheese Pasta", categoryId: "pasta" },
  { id: "mushroom-pasta", name: "Mushroom Pasta", categoryId: "pasta" },

  { id: "tea", name: "Tea", categoryId: "hot-drinks" },
  { id: "masala-tea", name: "Masala Tea", categoryId: "hot-drinks" },
  { id: "hot-coffee", name: "Hot Coffee", categoryId: "hot-drinks" },

  { id: "lemon-soda", name: "Lemon Soda", categoryId: "cold-drinks" },
  { id: "cold-coffee", name: "Cold Coffee", categoryId: "cold-drinks" },
  { id: "chocolate-cold-coffee", name: "Chocolate Cold Coffee", categoryId: "cold-drinks" },
  { id: "oreo-milk-shake", name: "Oreo Milk Shake", categoryId: "cold-drinks" },

  { id: "pav-bhaji", name: "Pav Bhaji", categoryId: "more" },
];
