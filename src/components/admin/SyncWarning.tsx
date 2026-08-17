type SyncState = {
  configured: boolean;
  remoteHealthy: boolean;
  lastSyncError: string;
};

export default function SyncWarning({
  state,
  label,
}: {
  state: SyncState;
  label: string;
}) {
  if (state.remoteHealthy) return null;

  return (
    <div className="mb-5 rounded-2xl border border-pink/40 bg-pink/15 p-4 text-sm text-pink/90 shadow-lg">
      <div className="flex items-center justify-between">
        <p className="font-heading text-xs font-bold tracking-[0.14em] text-pink">
          ⚠️ {label} SYNC ISSUE (FIREBASE SECURITY RULES)
        </p>
      </div>
      <p className="mt-1.5 text-white/90 text-xs leading-relaxed">
        {state.configured
          ? "Firebase cloud database is rejecting write permissions. To prevent items from disappearing after ~1 minute, update your Firestore Security Rules in the Firebase Console."
          : "Firebase is not configured in .env, so the app is using local browser storage only."}
      </p>

      {state.configured && (
        <div className="mt-3 rounded-xl bg-black/40 border border-pink/30 p-3 text-xs text-white/80 space-y-2">
          <p className="font-bold text-pink text-[11px] tracking-wide">HOW TO FIX PERMANENTLY IN FIREBASE CONSOLE:</p>
          <ol className="list-decimal list-inside space-y-1 text-white/70 text-[11px]">
            <li>Go to <a href="https://console.firebase.google.com/" target="_blank" rel="noreferrer" className="text-cyan underline">Firebase Console</a> → Project <code className="text-cyan">technocafe-8c8c5</code></li>
            <li>Click <strong>Firestore Database</strong> → <strong>Rules</strong> tab at the top.</li>
            <li>Replace existing rules with:
              <pre className="mt-1 bg-black/60 p-2 rounded text-[10px] text-cyan font-mono overflow-x-auto">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`}
              </pre>
            </li>
            <li>Click <strong>Publish</strong>.</li>
          </ol>
        </div>
      )}

      {state.lastSyncError && (
        <p className="mt-2 text-[10px] text-pink/70 break-words font-mono">
          Last Error: {state.lastSyncError}
        </p>
      )}
    </div>
  );
}
