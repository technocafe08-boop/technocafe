import { useEffect, useState } from "react";
import { categoriesStore, playModesStore } from "../lib/taxonomyStores";
import { settingsStore, type Settings } from "../lib/settingsStore";
import type { Category, PlayMode } from "../data/taxonomy";

export function useCategories(): Category[] {
  const [items, setItems] = useState<Category[]>(categoriesStore.getAll());
  useEffect(() => categoriesStore.subscribe(() => setItems(categoriesStore.getAll())), []);
  return items;
}

export function usePlayModes(): PlayMode[] {
  const [items, setItems] = useState<PlayMode[]>(playModesStore.getAll());
  useEffect(() => playModesStore.subscribe(() => setItems(playModesStore.getAll())), []);
  return items;
}

export function useSettings(): Settings {
  const [settings, setSettings] = useState<Settings>(settingsStore.get());
  useEffect(() => settingsStore.subscribe(() => setSettings(settingsStore.get())), []);
  return settings;
}
