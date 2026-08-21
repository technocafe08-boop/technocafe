import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db, firebaseConfigured } from "./firebase";
import { stripUndefinedValues } from "./firestoreStore";

export interface Settings {
  whatsappNumber: string;
  adminPassword: string;
  announcementText: string;
  membershipTitle: string;
  membershipDescription: string;
  membershipBenefits: string[];
  updatedAt?: number;
}

const DEFAULT_PASSWORD = "technocafe123";

const defaultSettings: Settings = {
  whatsappNumber: "",
  adminPassword: DEFAULT_PASSWORD,
  announcementText: "",
  membershipTitle: "MEMBERSHIP BENEFITS",
  membershipDescription: "Join the community and unlock perks made for regular gamers, families, and coffee runs.",
  membershipBenefits: [
    "Discounted hourly gaming rates",
    "Priority booking for busy weekends",
    "Exclusive member offers on food and drinks",
  ],
};

const cacheKey = "techno-cafe:settings";
const ref = doc(db, "settings", "main");

function canUseLocalStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readCache(): Settings | null {
  if (!canUseLocalStorage()) return null;
  try {
    const raw = window.localStorage.getItem(cacheKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Settings>;
    return { ...defaultSettings, ...parsed };
  } catch {
    return null;
  }
}

function writeCache(value: Settings): void {
  if (!canUseLocalStorage()) return;
  try {
    window.localStorage.setItem(cacheKey, JSON.stringify(value));
  } catch {
    // ignore cache write failures
  }
}

function getVersion(value: Settings | null | undefined): number {
  return typeof value?.updatedAt === "number" ? value.updatedAt : 0;
}

let settings: Settings = readCache() ?? { ...defaultSettings };
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
          const remote = { ...defaultSettings, ...(snap.data() as Partial<Settings>) };
          const cached = readCache();
          settings = getVersion(cached) > getVersion(remote) ? (cached as Settings) : remote;
          writeCache(settings);
          remoteHealthy = true;
          lastSyncError = "";
        } else if (!triedInit) {
          const cached = readCache();
          if (cached) {
            settings = cached;
            markDegraded("Remote settings doc is missing while local cache exists");
          } else {
            triedInit = true;
            setDoc(ref, { ...defaultSettings, updatedAt: Date.now() }).catch(() => {
              markDegraded("Failed to initialize default settings in Firestore");
            });
          }
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
    markDegraded("Firestore settings listener failed");
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
      settings = cached;
      listeners.forEach((l) => l());
    }
  });
}

export const settingsStore = {
  get(): Settings {
    return settings;
  },
  isReady(): boolean {
    return ready;
  },
  getSyncState() {
    return {
      remoteHealthy,
      lastSyncError,
      configured: firebaseConfigured,
    };
  },
  async update(updates: Partial<Settings>): Promise<void> {
    settings = { ...settings, ...updates, updatedAt: Date.now() };
    writeCache(settings);
    if (firebaseConfigured) {
      try {
        await setDoc(ref, stripUndefinedValues(settings), { merge: true });
        remoteHealthy = true;
        lastSyncError = "";
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : String(err);
        markDegraded(`Failed to save settings to Firestore: ${errMsg}`);
        throw new Error(`Firebase save failed (${errMsg}). Check your Firebase Firestore Security Rules.`);
      }
    }
  },
  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

export function buildWhatsAppLink(message: string): string {
  const text = encodeURIComponent(message);
  const number = settings.whatsappNumber.replace(/[^\d]/g, "");
  return number ? `https://wa.me/${number}?text=${text}` : `https://api.whatsapp.com/send?text=${text}`;
}
