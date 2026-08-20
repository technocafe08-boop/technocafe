import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db, firebaseConfigured } from "./firebase";
import { stripUndefinedValues } from "./firestoreStore";

export type SiteStats = {
  dailyCustomers: number;
  gamingPCs: number;
  happyCustomers: number;
  gameLibrary: number;
  updatedAt?: number;
};

const defaultStats: SiteStats = {
  dailyCustomers: 30,
  gamingPCs: 10,
  happyCustomers: 4000,
  gameLibrary: 2000,
};

const cacheKey = "techno-cafe:stats";
const ref = doc(db, "settings", "stats");

function canUseLocalStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readCache(): SiteStats | null {
  if (!canUseLocalStorage()) return null;
  try {
    const raw = window.localStorage.getItem(cacheKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SiteStats>;
    return { ...defaultStats, ...parsed };
  } catch {
    return null;
  }
}

function writeCache(value: SiteStats): void {
  if (!canUseLocalStorage()) return;
  try {
    window.localStorage.setItem(cacheKey, JSON.stringify(value));
  } catch {}
}

let stats: SiteStats = readCache() ?? { ...defaultStats };
let ready = false;
let triedInit = false;
let remoteHealthy = firebaseConfigured;
let lastSyncError = "";
const listeners = new Set<() => void>();

function markDegraded(message = "") {
  remoteHealthy = false;
  lastSyncError = message;
}

if (firebaseConfigured) {
  try {
    onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          stats = { ...defaultStats, ...(snap.data() as Partial<SiteStats>) };
          writeCache(stats);
          remoteHealthy = true;
          lastSyncError = "";
        } else if (!triedInit) {
          triedInit = true;
          const cached = readCache();
          if (cached) {
            stats = cached;
          }
          setDoc(ref, { ...stats, updatedAt: Date.now() }).catch(() =>
            markDegraded("Failed to initialize stats in Firestore")
          );
        }
        ready = true;
        listeners.forEach((l) => l());
      },
      (error) => {
        ready = true;
        markDegraded(error.message);
      }
    );
  } catch {
    ready = true;
    markDegraded("Firestore stats listener failed");
  }
} else {
  ready = true;
  markDegraded("Firebase is not configured");
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key !== cacheKey) return;
    const cached = readCache();
    if (cached) {
      stats = cached;
      listeners.forEach((l) => l());
    }
  });
}

export const statsStore = {
  get(): SiteStats {
    return stats;
  },
  isReady(): boolean {
    return ready;
  },
  getSyncState() {
    return { remoteHealthy, lastSyncError, configured: firebaseConfigured };
  },
  async update(updates: Partial<SiteStats>): Promise<void> {
    stats = { ...stats, ...updates, updatedAt: Date.now() };
    writeCache(stats);
    listeners.forEach((l) => l());
    if (firebaseConfigured) {
      try {
        await setDoc(ref, stripUndefinedValues(stats), { merge: true });
        remoteHealthy = true;
        lastSyncError = "";
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : String(err);
        markDegraded(`Failed to save stats to Firestore: ${errMsg}`);
        throw new Error(`Firebase save failed (${errMsg}). Check your Firebase Firestore Security Rules.`);
      }
    }
  },
  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};
