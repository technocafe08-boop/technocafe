import { useEffect, useState } from "react";
import { useSettings } from "../../hooks/useTaxonomy";
import { settingsStore } from "../../lib/settingsStore";
import { adminAuth } from "../../lib/adminAuth";
import SyncWarning from "../../components/admin/SyncWarning";

export default function SettingsTab({ onLogout }: { onLogout: () => void }) {
  const settings = useSettings();
  const [whatsapp, setWhatsapp] = useState(settings.whatsappNumber);
  const [savedWhatsapp, setSavedWhatsapp] = useState(false);
  const [announcement, setAnnouncement] = useState(settings.announcementText);
  const [savedAnnouncement, setSavedAnnouncement] = useState(false);
  const syncState = settingsStore.getSyncState();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passError, setPassError] = useState("");
  const [passSaved, setPassSaved] = useState(false);

  const [whatsappError, setWhatsappError] = useState("");
  const [announcementError, setAnnouncementError] = useState("");

  useEffect(() => setWhatsapp(settings.whatsappNumber), [settings.whatsappNumber]);
  useEffect(() => setAnnouncement(settings.announcementText), [settings.announcementText]);

  async function handleSaveWhatsapp(e: React.FormEvent) {
    e.preventDefault();
    setWhatsappError("");
    try {
      await settingsStore.update({ whatsappNumber: whatsapp.trim() });
      setSavedWhatsapp(true);
      setTimeout(() => setSavedWhatsapp(false), 2000);
    } catch (err) {
      setWhatsappError(err instanceof Error ? err.message : "Failed to save WhatsApp number.");
    }
  }

  async function handleSaveAnnouncement(e: React.FormEvent) {
    e.preventDefault();
    setAnnouncementError("");
    try {
      await settingsStore.update({ announcementText: announcement.trim() });
      setSavedAnnouncement(true);
      setTimeout(() => setSavedAnnouncement(false), 2000);
    } catch (err) {
      setAnnouncementError(err instanceof Error ? err.message : "Failed to save announcement.");
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPassError("");
    if (currentPassword !== settings.adminPassword) {
      setPassError("Current password is wrong.");
      return;
    }
    if (newPassword.trim().length < 4) {
      setPassError("New password must be at least 4 characters.");
      return;
    }
    try {
      await settingsStore.update({ adminPassword: newPassword.trim() });
      setCurrentPassword("");
      setNewPassword("");
      setPassSaved(true);
      setTimeout(() => setPassSaved(false), 2000);
    } catch (err) {
      setPassError(err instanceof Error ? err.message : "Failed to update password.");
    }
  }

  function handleLogout() {
    adminAuth.logout();
    onLogout();
  }

  return (
    <div>
      <SyncWarning state={syncState} label="SETTINGS" />
      <h2 className="font-heading text-lg font-bold text-white/80 mb-4">SETTINGS</h2>

      <section className="glass rounded-2xl p-5 md:p-6">
        <h3 className="font-heading text-sm font-bold mb-1 text-cyan tracking-wide">ANNOUNCEMENT BAR</h3>
        <p className="text-white/50 text-xs mb-4">
          This text shows on the public homepage banner. Leave it blank to hide the bar.
        </p>
        <form onSubmit={handleSaveAnnouncement} className="space-y-3">
          <textarea
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
            placeholder="e.g. New tournaments every weekend - book your slot now!"
            rows={3}
            className="w-full rounded-lg bg-white/5 border border-white/15 px-3.5 py-2.5 text-sm placeholder:text-white/30 focus:outline-none focus:border-cyan resize-none"
          />
          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="rounded-lg bg-cyan/20 border border-cyan/40 px-4 py-2 text-sm text-cyan hover:bg-cyan/30 font-heading tracking-wide"
            >
              {savedAnnouncement ? "SAVED" : "SAVE"}
            </button>
          </div>
        </form>
        {announcementError && <p className="mt-3 text-pink text-xs">{announcementError}</p>}
      </section>

      <section className="mt-6 glass rounded-2xl p-5 md:p-6">
        <h3 className="font-heading text-sm font-bold mb-1 text-cyan tracking-wide">WHATSAPP CONTACT</h3>
        <p className="text-white/50 text-xs mb-4">
          Used for every "Connect on WhatsApp" button on the site. Include the country code,
          digits only — e.g. 9198XXXXXXXX.
        </p>
        <form onSubmit={handleSaveWhatsapp} className="flex gap-2">
          <input
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="9198XXXXXXXX"
            className="flex-1 min-w-0 rounded-lg bg-white/5 border border-white/15 px-3.5 py-2.5 text-sm placeholder:text-white/30 focus:outline-none focus:border-cyan"
          />
          <button
            type="submit"
            className="shrink-0 rounded-lg bg-cyan/20 border border-cyan/40 px-4 text-sm text-cyan hover:bg-cyan/30 font-heading tracking-wide"
          >
            {savedWhatsapp ? "SAVED" : "SAVE"}
          </button>
        </form>
        {whatsappError && <p className="mt-3 text-pink text-xs">{whatsappError}</p>}
      </section>

      <section className="mt-6 glass rounded-2xl p-5 md:p-6">
        <h3 className="font-heading text-sm font-bold mb-1 text-cyan tracking-wide">ADMIN PASSWORD</h3>
        <p className="text-white/50 text-xs mb-4">Change the password used to log into this panel.</p>
        <form onSubmit={handleChangePassword} className="space-y-3">
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Current password"
            className="w-full rounded-lg bg-white/5 border border-white/15 px-3.5 py-2.5 text-sm placeholder:text-white/30 focus:outline-none focus:border-cyan"
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password"
            className="w-full rounded-lg bg-white/5 border border-white/15 px-3.5 py-2.5 text-sm placeholder:text-white/30 focus:outline-none focus:border-cyan"
          />
          {passError && <p className="text-pink text-xs">{passError}</p>}
          <button
            type="submit"
            className="rounded-lg bg-cyan/20 border border-cyan/40 px-4 py-2 text-sm text-cyan hover:bg-cyan/30 font-heading tracking-wide"
          >
            {passSaved ? "SAVED" : "UPDATE PASSWORD"}
          </button>
        </form>
      </section>

      <button
        type="button"
        onClick={handleLogout}
        className="mt-6 text-white/40 hover:text-pink transition-colors text-sm"
      >
        Log out
      </button>
    </div>
  );
}
