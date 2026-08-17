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
  price: number;
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
  { id: "classic-masala-maggi", name: "Classic Masala Maggi", price: 50, categoryId: "maggi" },
  { id: "veg-masala-maggi", name: "Veg Masala Maggi", price: 80, categoryId: "maggi" },
  { id: "egg-maggi", name: "Egg Maggi", price: 80, categoryId: "maggi" },
  { id: "cheese-maggi", name: "Cheese Maggi", price: 80, categoryId: "maggi" },

  { id: "cheese-corn-sandwich", name: "Cheese Corn Sandwich", price: 80, categoryId: "sandwich" },
  { id: "egg-mayo-sandwich", name: "Egg Mayo Sandwich", price: 80, categoryId: "sandwich" },

  { id: "masala-omelette", name: "Masala Omelette", price: 60, categoryId: "quick-bites" },
  { id: "cheese-omelette", name: "Cheese Omelette", price: 80, categoryId: "quick-bites" },

  { id: "masala-pasta", name: "Masala Pasta", price: 60, categoryId: "pasta" },
  { id: "egg-masala-pasta", name: "Egg Masala Pasta", price: 80, categoryId: "pasta" },
  { id: "cheese-pasta", name: "Cheese Pasta", price: 60, categoryId: "pasta" },
  { id: "mushroom-pasta", name: "Mushroom Pasta", price: 70, categoryId: "pasta" },

  { id: "tea", name: "Tea", price: 20, categoryId: "hot-drinks" },
  { id: "masala-tea", name: "Masala Tea", price: 30, categoryId: "hot-drinks" },
  { id: "hot-coffee", name: "Hot Coffee", price: 50, categoryId: "hot-drinks" },

  { id: "lemon-soda", name: "Lemon Soda", price: 50, categoryId: "cold-drinks" },
  { id: "cold-coffee", name: "Cold Coffee", price: 80, categoryId: "cold-drinks" },
  { id: "chocolate-cold-coffee", name: "Chocolate Cold Coffee", price: 100, categoryId: "cold-drinks" },
  { id: "oreo-milk-shake", name: "Oreo Milk Shake", price: 100, categoryId: "cold-drinks" },

  { id: "pav-bhaji", name: "Pav Bhaji", price: 80, categoryId: "more" },
];
