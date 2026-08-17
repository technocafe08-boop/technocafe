import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db, firebaseConfigured } from "./firebase";
import { stripUndefinedValues } from "./firestoreStore";

export interface Settings {
  /** Digits only, with country code, e.g. "9198XXXXXXXX" — no "+" or spaces. */
  whatsappNumber: string;
  /** Simple admin panel password. Not high-security — good enough to keep casual visitors out. */
  adminPassword: string;
}

const DEFAULT_PASSWORD = "technocafe123";

const defaultSettings: Settings = {
  whatsappNumber: "",
  adminPassword: DEFAULT_PASSWORD,
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
          settings = { ...defaultSettings, ...(snap.data() as Partial<Settings>) };
          writeCache(settings);
          remoteHealthy = true;
          lastSyncError = "";
        } else if (!triedInit) {
          // If Firestore has no doc but we already have cached settings, keep the cache.
          const cached = readCache();
          if (cached) {
            settings = cached;
            markDegraded("Remote settings doc is missing while local cache exists");
          } else {
            triedInit = true;
            setDoc(ref, defaultSettings).catch(() => {
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
    settings = { ...settings, ...updates };
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

/** Builds a WhatsApp deep link with a prefilled message. Falls back to the
 * generic web.whatsapp "send" endpoint (no number) if no number is configured yet,
 * which still opens a chat composer. */
export function buildWhatsAppLink(message: string): string {
  const text = encodeURIComponent(message);
  const number = settings.whatsappNumber.replace(/[^\d]/g, "");
  return number ? `https://wa.me/${number}?text=${text}` : `https://api.whatsapp.com/send?text=${text}`;
}
