import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import { db, firebaseConfigured } from "./firebase";

export interface FSItem {
  id: string;
  order?: number;
  [key: string]: unknown;
}

type Listener = () => void;

function slugify(base: string, existingIds: Set<string>): string {
  const clean =
    base
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "item";
  let id = clean;
  let n = 1;
  while (existingIds.has(id)) id = `${clean}-${n++}`;
  return id;
}

function canUseLocalStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readCache<T>(key: string): T[] | null {
  if (!canUseLocalStorage()) return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as T[]) : null;
  } catch {
    return null;
  }
}

function writeCache<T>(key: string, value: T[]): void {
  if (!canUseLocalStorage()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore cache write failures
  }
}

export function stripUndefinedValues<T>(value: T): T {
  if (Array.isArray(value)) {
    return value
      .map((item) => stripUndefinedValues(item))
      .filter((item) => item !== undefined) as T;
  }

  if (value && typeof value === "object" && !(value instanceof Date) && !(value instanceof Blob)) {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([, v]) => v !== undefined)
        .map(([key, v]) => [key, stripUndefinedValues(v)])
    ) as T;
  }

  return value;
}

/**
 * Creates a realtime, Firestore-backed store for a top-level collection.
 * Seeds the collection once (from `seed`) if it's empty, then keeps `items`
 * in sync via onSnapshot. Falls back to the seed data if Firestore isn't
 * configured yet, so the site still renders something sensible.
 */
export function createFirestoreStore<T extends FSItem>(collectionPath: string, seed: T[]) {
  const listeners = new Set<Listener>();
  const cacheKey = `techno-cafe:${collectionPath}`;
  let items: T[] = readCache<T>(cacheKey) ?? [...seed];
  let ready = false;
  let seedAttempted = false;
  let remoteHealthy = firebaseConfigured;
  let lastSyncError = "";

  function sortAndSet(next: T[]) {
    items = [...next].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    writeCache(cacheKey, items);
    listeners.forEach((l) => l());
  }

  function markDegraded(message = "") {
    remoteHealthy = false;
    lastSyncError = message;
  }

  function seedIfNeeded(emptySnap: boolean) {
    if (!firebaseConfigured || seedAttempted || seed.length === 0) return;
    seedAttempted = true;
    if (emptySnap) {
      const batch = writeBatch(db);
      seed.forEach((s, i) => {
        const { id, ...rest } = s;
        batch.set(doc(db, collectionPath, id), stripUndefinedValues({ ...rest, id, order: s.order ?? i }));
      });
      batch.commit().catch(() => markDegraded("Unable to seed Firestore"));
    }
  }

  if (typeof window !== "undefined") {
    window.addEventListener("storage", (event) => {
      if (event.key !== cacheKey) return;
      const cached = readCache<T>(cacheKey);
      if (cached) {
        sortAndSet(cached);
      } else {
        sortAndSet(seed);
      }
    });
  }

  if (firebaseConfigured) {
    try {
      onSnapshot(
        collection(db, collectionPath),
        (snap) => {
          ready = true;
          seedIfNeeded(snap.empty);

          const remoteItems = snap.docs.map((d) => ({ ...(d.data() as T), id: d.id }));
          const remoteMap = new Map(remoteItems.map((it) => [it.id, it]));

          // Always merge remote items with any locally added/cached items that are not in remoteItems yet
          const merged = [...remoteItems];
          for (const localIt of items) {
            if (!remoteMap.has(localIt.id)) {
              merged.push(localIt);
            }
          }

          if (remoteItems.length === 0 && items.length > 0) {
            markDegraded("Remote collection is empty while local cache still has data");
          } else {
            remoteHealthy = true;
            lastSyncError = "";
          }

          sortAndSet(merged);
        },
        (error) => {
          ready = true;
          markDegraded(error.message);
        }
      );
    } catch {
      ready = true;
      markDegraded("Firestore snapshot listener failed");
    }
  } else {
    ready = true;
    markDegraded("Firebase is not configured");
  }

  return {
    getAll(): T[] {
      return items;
    },
    getById(id: string): T | undefined {
      return items.find((it) => it.id === id);
    },
    isReady(): boolean {
      return ready;
    },
    /** Adds a new document. Pass `explicitId` to control the doc id (else derived from `name`). */
    async add(data: Omit<T, "id" | "order">, explicitId?: string): Promise<string> {
      const existingIds = new Set(items.map((it) => it.id));
      const name = (data as { name?: string }).name || "item";
      const id = explicitId || slugify(name, existingIds);
      const order = items.length;
      const nextItem = { ...(data as Record<string, unknown>), id, order } as T;
      sortAndSet([...items, nextItem]);
      if (firebaseConfigured) {
        try {
          await setDoc(doc(db, collectionPath, id), stripUndefinedValues({ ...data, id, order }));
          remoteHealthy = true;
          lastSyncError = "";
        } catch (err) {
          const errMsg = err instanceof Error ? err.message : String(err);
          markDegraded(`Failed to save "${id}" to Firestore: ${errMsg}`);
          throw new Error(`Firebase save failed (${errMsg}). Check your Firebase Firestore Security Rules.`);
        }
      }
      return id;
    },
    async update(id: string, data: Partial<Omit<T, "id">>): Promise<void> {
      sortAndSet(items.map((item) => (item.id === id ? ({ ...item, ...data } as T) : item)));
      if (firebaseConfigured) {
        try {
          await setDoc(doc(db, collectionPath, id), stripUndefinedValues(data), { merge: true });
          remoteHealthy = true;
          lastSyncError = "";
        } catch (err) {
          const errMsg = err instanceof Error ? err.message : String(err);
          markDegraded(`Failed to update "${id}" in Firestore: ${errMsg}`);
          throw new Error(`Firebase update failed (${errMsg}). Check your Firebase Firestore Security Rules.`);
        }
      }
    },
    async remove(id: string): Promise<void> {
      sortAndSet(items.filter((item) => item.id !== id));
      if (firebaseConfigured) {
        try {
          await deleteDoc(doc(db, collectionPath, id));
          remoteHealthy = true;
          lastSyncError = "";
        } catch (err) {
          const errMsg = err instanceof Error ? err.message : String(err);
          markDegraded(`Failed to delete "${id}" from Firestore: ${errMsg}`);
          throw new Error(`Firebase delete failed (${errMsg}). Check your Firebase Firestore Security Rules.`);
        }
      }
    },
    async reorder(orderedIds: string[]): Promise<void> {
      const next = orderedIds
        .map((id, i) => {
          const item = items.find((it) => it.id === id);
          return item ? ({ ...item, order: i } as T) : null;
        })
        .filter((item): item is T => item !== null);
      sortAndSet(next);
      if (firebaseConfigured) {
        const batch = writeBatch(db);
        orderedIds.forEach((id, i) =>
          batch.set(doc(db, collectionPath, id), stripUndefinedValues({ order: i }), { merge: true })
        );
        try {
          await batch.commit();
          remoteHealthy = true;
          lastSyncError = "";
        } catch (err) {
          const errMsg = err instanceof Error ? err.message : String(err);
          markDegraded(`Failed to reorder Firestore documents: ${errMsg}`);
          throw new Error(`Firebase reorder failed (${errMsg}). Check your Firebase Firestore Security Rules.`);
        }
      }
    },
    subscribe(listener: Listener): () => void {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getSyncState() {
      return {
        remoteHealthy,
        lastSyncError,
        configured: firebaseConfigured,
      };
    },
  };
}
