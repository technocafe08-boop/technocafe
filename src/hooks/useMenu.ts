import { useEffect, useState } from "react";
import { menuCategoriesStore, menuItemsStore, menuSubCategoriesStore } from "../lib/menuStore";
import type { MenuCategory, MenuItem, MenuSubCategory } from "../data/menu";

export function useMenuCategories(): MenuCategory[] {
  const [items, setItems] = useState<MenuCategory[]>(menuCategoriesStore.getAll());
  useEffect(() => menuCategoriesStore.subscribe(() => setItems(menuCategoriesStore.getAll())), []);
  return items;
}

export function useMenuSubCategories(): MenuSubCategory[] {
  const [items, setItems] = useState<MenuSubCategory[]>(menuSubCategoriesStore.getAll());
  useEffect(
    () => menuSubCategoriesStore.subscribe(() => setItems(menuSubCategoriesStore.getAll())),
    []
  );
  return items;
}

export function useMenuItems(): MenuItem[] {
  const [items, setItems] = useState<MenuItem[]>(menuItemsStore.getAll());
  useEffect(() => menuItemsStore.subscribe(() => setItems(menuItemsStore.getAll())), []);
  return items;
}
