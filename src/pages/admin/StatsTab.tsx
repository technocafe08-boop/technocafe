import { useState } from "react";
import { statsStore } from "../../lib/statsStore";
import type { SiteStats } from "../../lib/statsStore";

export default function StatsTab() {
  const current = statsStore.get();
  const [form, setForm] = useState<SiteStats>({
    dailyCustomers: current.dailyCustomers,
    gamingPCs: current.gamingPCs,
    happyCustomers: current.happyCustomers,
    gameLibrary: current.gameLibrary,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function handleChange(field: keyof SiteStats, raw: string) {
    const val = parseInt(raw, 10);
    setForm((f) => ({ ...f, [field]: isNaN(val) ? 0 : val }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      await statsStore.update(form);
      setSaved(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  const fields: { key: keyof SiteStats; label: string; description: string }[] = [
    { key: "dailyCustomers", label: "Daily Customers", description: "Number of customers per day" },
    { key: "gamingPCs", label: "Gaming PCs", description: "Total gaming PC stations" },
    { key: "happyCustomers", label: "Happy Customers", description: "Total happy customers milestone" },
    { key: "gameLibrary", label: "Game Library", description: "Total games available" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-bold text-white">Site Statistics</h2>
        <p className="mt-1 text-white/50 text-sm">
          Edit the numbers shown in the stats bar on the homepage.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map(({ key, label, description }) => (
          <div key={key} className="glass rounded-xl p-4 space-y-2">
            <label className="block font-heading text-sm text-cyan tracking-wide">
              {label}
            </label>
            <p className="text-white/40 text-xs">{description}</p>
            <input
              type="number"
              min={0}
              value={form[key] as number}
              onChange={(e) => handleChange(key, e.target.value)}
              className="w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-white font-heading text-xl focus:outline-none focus:border-cyan/60 transition-colors"
            />
            <p className="text-white/30 text-xs">Displayed as: {form[key] as number}+</p>
          </div>
        ))}
      </div>

      {error && (
        <p className="text-pink text-sm font-body">{error}</p>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="rounded-full px-6 py-2.5 text-sm font-heading tracking-wide bg-gradient-to-r from-cyan to-purple text-black neon-box-cyan disabled:opacity-50 transition-opacity"
      >
        {saving ? "Saving…" : saved ? "✓ Saved!" : "Save Changes"}
      </button>
    </div>
  );
}
