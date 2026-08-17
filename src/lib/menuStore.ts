import { createFirestoreStore } from "./firestoreStore";
import {
  defaultMenuCategories,
  defaultMenuItems,
  defaultMenuSubCategories,
  type MenuCategory,
  type MenuItem,
  type MenuSubCategory,
} from "../data/menu";

export const menuCategoriesStore = createFirestoreStore<MenuCategory>(
  "menuCategories",
  defaultMenuCategories
);
export const menuSubCategoriesStore = createFirestoreStore<MenuSubCategory>(
  "menuSubCategories",
  defaultMenuSubCategories
);
const menuItems = createFirestoreStore<MenuItem>("menuItems", defaultMenuItems);

export const menuItemsStore = {
  getAll: () => menuItems.getAll(),
  getById: (id: string) => menuItems.getById(id),
  isReady: () => menuItems.isReady(),
  getSyncState: () => menuItems.getSyncState(),
  add: (item: Omit<MenuItem, "id" | "order">, explicitId?: string) => menuItems.add(item, explicitId),
  update: (id: string, updates: Partial<Omit<MenuItem, "id">>) => menuItems.update(id, updates),
  remove: (id: string) => menuItems.remove(id),
  subscribe: (listener: () => void) => menuItems.subscribe(listener),
};
